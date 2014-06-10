var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
});

casper.test.begin('Reset pin returns 403 (not authed / CSRF fail)', {
  test: function(test) {

    // Initial auth
    helpers.doLogin();

    // On enter pin page click forgot pin link.
    casper.waitForUrl(helpers.url('enter-pin'), function() {
      this.click('.forgot-pin a');
    });

    // Then continue...
    casper.waitForUrl(helpers.url('reset-start'), function() {
      // Setup re-auth verification.
      helpers.fakeVerification({reverify: true});
      helpers.fakeLogout();
      // Setup the fetch which proivided pin_reset_started state.
      this.click('.button.cta');
    });

    casper.waitForUrl(helpers.url('reset-pin'), function() {
      // Setup 403 on trying to reset the pin.
      helpers.fakePinData({data: {pin: true}, method: 'PATCH', statusCode: 403});

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
      helpers.assertErrorCode('PIN_RESET_PERM_DENIED');
    });

    casper.run(function() {
      test.done();
    });
  },
});
