var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/spa/provider/boku/payment-failed/WHAT_EVER',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
  },
});

casper.test.begin('Check bad error code', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('UNEXPECTED_ERROR_CODE');
    });

    casper.run(function() {
      test.done();
    });
  },
});
