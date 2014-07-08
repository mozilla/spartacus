var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/spa/provider/boku/complete-payment',
  sinon: {
    consumeStack: true
  },
  setUp: function(){
    // As consumeStack is true, responses added with respondWith will be consumed in order.
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeWaitPoll({type: 'finish', statusData: 3});
    helpers.fakeWaitPoll({type: 'finish'});
  },
});

casper.test.begin('Check complete-payment polling.', {
  test: function(test) {

    // The expectation here is that the user should be logged in already.
    // but as tests dump state the proves the login flow still works in front
    // of this view.
    helpers.doLogin();

    casper.waitForSelector('.throbber', function() {
      // Progress will be shown as we are returning a non-pending state for the first request.
      test.assertVisible('progress', 'Check progress is shown on complete-payment');
    });

    casper.waitForSelector('.full-error', function() {
      // This is due to no native paymentSuccess function. But it does
      // show we've reached the success point in the app.
      // TODO: When a shim is added this will need to be updated.
      helpers.assertErrorCode('NO_PAY_SUCCESS_FUNC');
    });

    casper.run(function() {
      test.done();
    });
  },
});
