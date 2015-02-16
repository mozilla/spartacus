helpers.startCasper({
  path: '/mozpay/provider/reference/user-cancelled',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.spyOnMozPaymentProvider();
  },
});

casper.test.begin('Check payment failed', {
  test: function(test) {

    helpers.doLogin();

    helpers.waitForMozPayment(function(mozPayProviderSpy) {
      test.assertTrue(mozPayProviderSpy.paymentFailed.calledOnce);
      test.assertEqual(mozPayProviderSpy.paymentFailed.firstCall.args[0], 'USER_CANCELLED');
    });

    casper.run(function() {
      test.done();
    });
  },
});
