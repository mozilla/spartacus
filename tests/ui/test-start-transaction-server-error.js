var errorCode = 'SIM_ONLY_KEY';  // some server error

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction(
      {statusCode: 500, response: {error_code: errorCode,
                                   error: "Detailed explanation."}});
  },
});

casper.test.begin('Transaction failure should pass through server error.', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode(errorCode);
    });

    casper.run(function() {
      test.done();
    });
  },
});
