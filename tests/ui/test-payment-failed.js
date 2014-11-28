var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/provider/reference/error',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
  },
});

casper.test.begin('Check payment failed', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      // Check code is present (ensure it was picked up from the data attr)
      helpers.assertErrorCode('TEST_ERROR_CODE');
    });

    casper.run(function() {
      test.done();
    });
  },
});
