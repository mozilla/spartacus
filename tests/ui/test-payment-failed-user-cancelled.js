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

    casper.then(function() {
      helpers.assertPaymentFailed(['USER_CANCELLED']);
    });

    casper.run(function() {
      test.done();
    });
  },
});
