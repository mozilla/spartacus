var helpers = require('../helpers');

helpers.startCasper('/mozpay', function(){
  // Make pinStateCheck return true for pin.
  helpers.fakePinData({pin: true});
  // Make create-pin API call return 400
  helpers.fakePinData({pin: true, pin_is_locked_out: true}, 'POST', 400, '/mozpay/v1/api/pin/check/');
});

casper.test.begin('Login Enter Pin API call returns locked screen when API says it\'s locked', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl('/mozpay/enter-pin', function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    // When the api returns pin_is_locked_out set to true the listeners should redirect
    // to /locked.
    casper.waitForUrl('/mozpay/locked', function() {
      test.assertVisible('.locked');
      helpers.assertErrorCode('PIN_LOCKED');
    });

    casper.run(function() {
      test.done();
    });
  },
});
