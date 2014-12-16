var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
    helpers.spyOnMozPaymentProvider();
  },
});

casper.test.begin('Reset pin returns 400 invalid data.', {
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
    casper.waitForSelector('#signin', function() {
      helpers.fakeVerification({reverify: true});
      this.click('#signin');
    });

    casper.waitForUrl(helpers.url('reset-pin'), function() {
      // Setup 400 on trying to reset the pin.
      helpers.fakePinData({data: {pin: true}, method: 'PATCH', statusCode: 400});
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
      helpers.assertErrorCode('PIN_RESET_INVALID');
      test.assertElementCount('.full-error .button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.full-error .button');
    });

    helpers.waitForMozPayment(function(mozPayProviderSpy) {
      test.assertEqual(mozPayProviderSpy.paymentFailed.firstCall.args,
                       ['PIN_RESET_INVALID']);
    });

    casper.run(function() {
      test.done();
    });
  },
});
