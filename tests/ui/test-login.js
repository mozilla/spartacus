var helpers = require('../helpers');

helpers.startCasper('');

casper.test.begin('Login test', {

  test: function(test) {

    casper.waitForUrl('/login', function() {
      helpers.logInAsNewUser();
    });

    casper.waitForUrl('/enter-pin', function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
    });

    casper.run(function() {
      test.done();
    });
  },
});
