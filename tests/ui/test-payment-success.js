helpers.startCasper({
  path: '/mozpay/provider/reference/success',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.spyOnMozPaymentProvider();
  },
});

casper.test.begin('Check a payment success', {
  test: function(test) {

    helpers.doLogin();

    helpers.waitForMozPayment(function(mozPayProviderSpy) {
      test.assertTrue(mozPayProviderSpy.paymentSuccess.called);
    });

    casper.run(function() {
      test.done();
    });
  },
});
