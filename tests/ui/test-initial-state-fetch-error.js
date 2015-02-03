helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({statusCode: 500});
    helpers.spyOnMozPaymentProvider();
  }
});

casper.test.begin('Make initial pin fetch error, then retry with success.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('PIN_STATE_ERROR');
      test.assertVisible('.full-error .button', 'Cancel button should be visible');
      test.assertElementCount('.full-error .button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.full-error .button');
    });

    helpers.waitForMozPayment(function(mozPayProviderSpy) {
      test.assertEqual(mozPayProviderSpy.paymentFailed.firstCall.args,
                       ['PIN_STATE_ERROR']);
    });

    casper.run(function() {
      test.done();
    });

  },
});
