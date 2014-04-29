var helpers = require('../helpers');


helpers.startCasper('/mozpay', function(){
  helpers.fakePinData({pin: true});
});

casper.test.begin('Login test has pin', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl('/mozpay/enter-pin', function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
    });

    casper.run(function() {
      test.done();
    });
  },
});
