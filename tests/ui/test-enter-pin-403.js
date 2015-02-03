helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.spyOnMozPaymentProvider();
    helpers.fakePinData({data: {pin: true}});
    helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 403, url: '/mozpay/v1/api/pin/check/'});
  },
});

casper.test.begin('Enter Pin API call returns 403', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitUntilVisible('.full-error', function() {
      test.assertVisible('.full-error', 'Error page should be shown');
      helpers.assertErrorCode('PIN_ENTER_PERM_DENIED');
      test.assertElementCount('.full-error .button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.full-error .button');
    });

    helpers.waitForMozPayment(function(mozPayProviderSpy) {
      test.assertEqual(mozPayProviderSpy.paymentFailed.firstCall.args,
                       ['PIN_ENTER_PERM_DENIED']);
    });

    casper.run(function() {
      test.done();
    });
  },
});
