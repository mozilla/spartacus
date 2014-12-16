var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.spyOnMozPaymentProvider();
    helpers.fakePinData({data: {pin: false}});
    helpers.fakePinData({data: {pin: false}, method: 'POST', statusCode: 400});
  },
});

casper.test.begin('Create pin returns 400 (invalid data)', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
      test.assertExists('.cta:disabled', 'Submit button is disabled at start of pin confirmation.');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitUntilVisible('.full-error', function() {
      test.assertVisible('.full-error', 'Error page should be shown');
      helpers.assertErrorCode('PIN_CREATE_INVALID');
      test.assertElementCount('.full-error .button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.full-error .button');
    });

    helpers.waitForMozPayment(function(mozPayProviderSpy) {
      test.assertEqual(mozPayProviderSpy.paymentFailed.firstCall.args,
                       ['PIN_CREATE_INVALID']);
    });

    casper.run(function() {
      test.done();
    });
  },
});
