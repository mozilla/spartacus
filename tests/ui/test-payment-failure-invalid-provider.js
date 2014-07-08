var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/spa/provider/whatever/payment-failed/NO_ACTIVE_TRANS',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
  },
});

casper.test.begin('Check bad provider error', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('INVALID_PROVIDER');
    });

    casper.run(function() {
      test.done();
    });
  },
});
