var helpers = require('../helpers');

helpers.startCasper('/mozpay/', function(){
  // Make pinStateCheck return true for pin.
  helpers.fakePinData({pin: true});
  // Make create-pin API call return 400
  helpers.fakePinData({pin: true, pin_is_locked_out: true}, 'POST', 400, '/mozpay/v1/api/pin/check/');
});

casper.test.begin('Login Enter Pin API call returns locked screen when API says it\'s locked', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    // When the api returns pin_is_locked_out set to true the listeners should redirect
    // to /locked.
    casper.waitForUrl(helpers.url('locked'), function() {
      test.assertVisible('.locked');
      helpers.assertErrorCode('PIN_LOCKED');
      test.assertElementCount('.button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.button');
    });

    casper.waitUntilVisible('.throbber', function() {
      test.assertSelectorHasText('.msg', 'Payment Cancelled', 'Check cancelled throbber is displayed');
    });

    casper.run(function() {
      test.done();
    });
  },
});
