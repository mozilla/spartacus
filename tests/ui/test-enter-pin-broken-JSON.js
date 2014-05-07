var helpers = require('../helpers');

helpers.startCasper('/mozpay/', function(){
  // Make pinStateCheck return true for pin.
  helpers.fakePinData({pin: true});
  // Make create-pin return broken JSON
  helpers.fakeBrokenJSON('POST', 400, '/mozpay/v1/api/pin/check/');
});

casper.test.begin('Login Enter Pin API call returns JSON parse error with bad JSON', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitUntilVisible('.full-error', function() {
      test.assertVisible('.full-error', 'Error page should be shown');
      helpers.assertErrorCode('PIN_ENTER_JSON_PARSE_ERROR');
    });

    casper.run(function() {
      test.done();
    });
  },
});
