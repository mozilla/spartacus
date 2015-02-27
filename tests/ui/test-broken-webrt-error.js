var helpers = require('../helpers');

helpers.startCasper({
  userAgent: 'mac-webrt',
  path: '/mozpay/provider/reference/error',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.spyOnMozPaymentProvider({onNavigator: false});
  },
});

casper.test.begin('Check a payment success', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('TEST_ERROR_CODE');
    });

    casper.run(function() {
      test.done();
    });
  },
});
