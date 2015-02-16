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

    casper.then(function() {
      helpers.assertPaymentSuccess();
    });

    casper.run(function() {
      test.done();
    });
  },
});
