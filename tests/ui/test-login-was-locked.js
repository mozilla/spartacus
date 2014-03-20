var helpers = require('../helpers');

helpers.startCasper('/mozpay', function(){
  helpers.injectSinon();
  helpers.fakeVerificationSuccess();
  helpers.fakePinData({pin: true, pin_was_locked_out: true});
});

casper.test.begin('Login then was-locked', {
  test: function(test) {

    casper.waitForUrl('/mozpay/login', function() {
      helpers.logInAsNewUser();
    });

    casper.waitForUrl('/mozpay/was-locked', function() {
      test.assertSelectorHasText('h1', 'Your Pin was locked');
    });

    casper.run(function() {
      test.done();
    });

  },
});
