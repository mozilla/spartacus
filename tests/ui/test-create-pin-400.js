var helpers = require('../helpers');

helpers.startCasper('/mozpay', function(){
  helpers.injectSinon();
  helpers.fakeVerificationSuccess();
  // Make pinStateCheck return false for pin.
  helpers.fakePinData({pin: false});
  // Make create-pin API call return 204
  helpers.fakePinData({pin: false}, 'POST', 400);
});

casper.test.begin('Create pin returns 400 (invalid data)', {
  test: function(test) {

    casper.waitForUrl('/mozpay/login', function() {
      helpers.logInAsNewUser();
    });

    casper.waitForUrl('/mozpay/create-pin', function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitForSelector('.stage-two', function() {
      test.assertExists('.cta:disabled', 'Submit button is disabled at start of stage two');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitUntilVisible('.full-error', function() {
      test.assertVisible('.full-error', 'Error page should be shown');
    });

    casper.run(function() {
      test.done();
    });
  },
});
