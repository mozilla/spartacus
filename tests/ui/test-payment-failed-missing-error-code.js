helpers.startCasper({
  path: '/mozpay/provider/reference/no-error-code',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
  },
});

casper.test.begin('Check payment failed with no error code.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      // this is what happens with no error code in the data-error-code attr.
      helpers.assertErrorCode('MISSING_ERROR_CODE');
    });

    casper.run(function() {
      test.done();
    });
  },
});
