var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/spa/provider/reference/complete-payment',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
  },
});

casper.test.begin('Check we call paymentSuccess when Zippy is the provider.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      // TODO: this will need updating when there's a desktop shim.
      helpers.assertErrorCode('NO_PAY_SUCCESS');
    });

    casper.run(function() {
      test.done();
    });
  },
});
