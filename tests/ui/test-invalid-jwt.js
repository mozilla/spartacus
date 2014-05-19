var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/',  // No JWT
});

casper.test.begin('Check invalid JWT', {
  test: function(test) {

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('INVALID_JWT');
    });

    casper.run(function() {
      test.done();
    });

  },
});
