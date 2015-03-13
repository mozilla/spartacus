helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction({payment_required: false});
    helpers.spyOnMozPaymentProvider();
  },
});

casper.test.begin('Check when payment_required is false paymentSuccess is called', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.throbber', function() {
      test.assertVisible('.progress', 'Check progress is shown on paymentSuccess');
      helpers.assertPaymentSuccess();
    });

    casper.run(function() {
      test.done();
    });
  },
});
