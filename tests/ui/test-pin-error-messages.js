var helpers = require('../helpers');

helpers.startCasper('/mozpay', function(){
  helpers.injectSinon();
  helpers.fakeVerificationSuccess();
  helpers.fakePinData({pin: false});
});


casper.test.begin('Login test no pin', {

  test: function(test) {

    casper.waitForUrl('/mozpay/login', function() {
      helpers.logInAsNewUser();
    });

    casper.waitForUrl('/mozpay/create-pin', function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertExists('button[type=submit]:disabled', 'Submit button is disabled prior to pin entry');
      this.sendKeys('.pinbox', 'a');
      test.assertVisible('.err-msg', 'Error message should be visible on non-digit input.');
      this.sendKeys('.pinbox', '1');
      test.assertNotVisible('.err-msg', 'Error message should be cleared when entering digits after an error being shown.');
      this.sendKeys('.pinbox', '234');
      test.assertExists('button[type=submit]:enabled', 'Submit button is enabled');
    });

    casper.run(function() {
      test.done();
    });
  },
});
