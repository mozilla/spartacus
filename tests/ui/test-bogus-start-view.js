var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/bogus-start-attr',
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
  },
});

casper.test.begin('Check a bogus data-start-view attr shows an error.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('NO_MAPPED_ROUTE');
    });

    casper.run(function() {
      test.done();
    });
  },
});
