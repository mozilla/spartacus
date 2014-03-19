var helpers = require('../helpers');

helpers.startCasper('/mozpay/');

casper.test.begin('Basic test', {

  test: function(test) {

    // Run the tests.
    casper.waitForSelector('#app', function then() {
      test.assertVisible('#app');
    });

    casper.run(function() {
      test.done();
    });
  },
});
