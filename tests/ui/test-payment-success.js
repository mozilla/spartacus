var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/provider/reference/success',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
  },
});

casper.test.begin('Check a payment success', {
  test: function(test) {

    helpers.doLogin();

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
