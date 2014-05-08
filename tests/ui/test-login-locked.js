var helpers = require('../helpers');

helpers.startCasper('/mozpay/', function(){
  helpers.fakePinData({pin: true, pin_is_locked_out: true});
});

casper.test.begin('Login then locked', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('locked'), function() {
      test.assertVisible('.locked');
      helpers.assertErrorCode('PIN_LOCKED');
    });

    casper.run(function() {
      test.done();
    });

  },
});
