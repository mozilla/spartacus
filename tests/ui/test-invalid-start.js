var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/spa/reset-pin',  // No JWT
});

casper.test.begin('Check non-mozpay url to start.', {
  test: function(test) {

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('INVALID_JWT');
    });

    casper.run(function() {
      test.done();
    });

  },
});
