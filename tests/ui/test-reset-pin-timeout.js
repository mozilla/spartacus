var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
});

casper.test.begin('Reset pin timeout followed by success.', {
  test: function(test) {

    // Initial auth
    helpers.doLogin();

    // On enter pin page click forgot pin link.
    casper.waitForUrl(helpers.url('enter-pin'), function() {
      this.click('.forgot-pin a');
    });

    // Then continue...
    casper.waitForUrl(helpers.url('reset-start'), function() {
      helpers.fakeLogout();
      this.click('.button.cta');
    });

    // Click for re-auth...
    casper.waitForUrl(helpers.url('force-auth'), function() {
      helpers.fakeVerification({reverify: true});
      this.click('#signin');
    });

    casper.waitForUrl(helpers.url('reset-pin'), function() {
      // Setup 400 on trying to reset the pin.
      helpers.fakePinData({timeout: true, method: 'PATCH'});
      test.assertVisible('.pinbox', 'Pin reset widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
      test.assertExists('.cta:disabled', 'Submit button is disabled at start of pin confirmation.');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitForSelector('.full-error', function() {
      test.assertVisible('.full-error', 'Error page should be shown');
      helpers.assertErrorCode('PIN_RESET_TIMEOUT');
      test.assertVisible('.button.cta', 'CTA buttons should be visible');
      test.assertVisible('.button.cancel', 'Cancel button should be visible');
      helpers.fakePinData({data: {pin: true}, method: 'PATCH', statusCode: 204});
      this.click('.cta');
    });

    casper.waitForUrl(helpers.url('wait-to-start'), function() {
      // Throbber should be visible.
      test.assertVisible('.progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
