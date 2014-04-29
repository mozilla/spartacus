var helpers = require('../helpers');

helpers.startCasper('/mozpay', function(){
  // Make pinStateCheck return false for pin.
  helpers.fakePinData({pin: false});
  // Make create-pin API call return 201
  helpers.fakePinData({pin: true}, 'POST', 201);
});

casper.test.begin('Login test has pin', {
  test: function(test) {

    helpers.doLogin();

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

    casper.waitForUrl('/mozpay/wait-for-tx', function() {
      // Throbber should be visible.
      test.assertVisible('progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
