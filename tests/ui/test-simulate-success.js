helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction({simulate: {result: "postback"}});
    helpers.fakeSimulate();
    helpers.spyOnMozPaymentProvider();
  },
});

casper.test.begin('Simulate success', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('simulate'), function() {
      test.assertVisible('.simulate', 'Simulate page should be displayed');
      this.click('.cta');
    });

    helpers.waitForMozPayment(function(mozPayProviderSpy) {
      test.assertTrue(mozPayProviderSpy.paymentSuccess.called);
    });

    casper.run(function() {
      test.done();
    });
  },
});
