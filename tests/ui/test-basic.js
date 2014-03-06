var helpers = require('../helpers');

helpers.startCasper('/');

casper.test.begin('Basic test', {

  test: function(test) {

    // Run the tests.
    casper.waitForSelector('#app', function then() {
      test.assertEqual(1, 1);
    });

    casper.run(function() {
      test.done();
    });
  },
});
