var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/spa/provider/boku/payment-failed/NO_ACTIVE_TRANS',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
  },
});

casper.test.begin('Check error code in error message', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('NO_ACTIVE_TRANS');
    });

    casper.run(function() {
      test.done();
    });
  },
});
