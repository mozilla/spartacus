var helpers = require('../helpers');

helpers.startCasper('/mozpay', function(){
  helpers.injectSinon();
  helpers.fakeVerificationSuccess();
  helpers.fakePinData({pin: true, pin_is_locked_out: true});
});

casper.test.begin('Login then locked', {
  test: function(test) {

    casper.waitForUrl('/mozpay/login', function() {
      helpers.logInAsNewUser();
    });

    casper.waitForUrl('/mozpay/locked', function() {
      test.assertSelectorHasText('h1', 'Error');
      test.assertVisible('.full-error');
      test.assertSelectorHasText('.msg', 'You entered the wrong pin too many times. Your account is locked. Please try your purchase again in 5 minutes.');
    });

    casper.run(function() {
      test.done();
    });

  },
});
