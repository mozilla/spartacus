var helpers = require('../helpers');

helpers.startCasper({
  useFxA: true,
  setUp: function(){
    helpers.fakeFxA(200);
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
});

casper.test.begin('Reset pin returns 204, then onto wait for tx.', {
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
      this.click('#signin');
    });

    casper.waitForUrl(helpers.url('reset-pin'), function() {
      // Setup 204 for a successful reset.
      helpers.fakePinData({data: {pin: true}, method: 'PATCH', statusCode: 204});

      test.assertVisible('.pinbox', 'Pin reset widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
      test.assertExists('.cta:disabled', 'Submit button is disabled at start of pin confirmation.');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitForUrl(helpers.url('wait-to-start'), function() {
      test.assertVisible('.progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
