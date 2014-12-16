var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/provider/boku/wait-to-finish',
  sinon: {
    consumeStack: true
  },
  setUp: function(){
    // As consumeStack is true, responses added with respondWith will be consumed in order.
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.spyOnMozPaymentProvider();
    helpers.fakeWaitPoll({type: 'finish', statusData: 3});
    helpers.fakeWaitPoll({type: 'finish'});
  },
});

casper.test.begin('Check wait-to-finish polling.', {
  test: function(test) {

    // The expectation here is that the user should be logged in already.
    // but as tests dump state the proves the login flow still works in front
    // of this view.
    helpers.doLogin();

    casper.waitForSelector('.throbber', function() {
      // Progress will be shown as we are returning a non-pending state for the first request.
      test.assertVisible('.progress', 'Check progress is shown on wait-to-finish');
    });

    helpers.waitForMozPayment(function(mozPayProviderSpy) {
      test.assertTrue(mozPayProviderSpy.paymentSuccess.called);
    });

    casper.run(function() {
      test.done();
    });
  },
});
