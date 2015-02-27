var helpers = require('../helpers');

helpers.startCasper({
  userAgent: 'mac-webrt',
  path: '/mozpay/provider/reference/success',
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
      // Even though it's successful, we show a message with the error template
      // about closing the window.
      casper.test.assertSelectorHasText('.msg', 'Close the window');
    });

    casper.run(function() {
      test.done();
    });
  },
});
