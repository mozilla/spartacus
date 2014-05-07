var helpers = require('../helpers');


helpers.startCasper('/mozpay/', function(){
  helpers.fakePinData({pin: true});
});


casper.test.begin('Test error message when user has already created a pin', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertVisible('.forgot-pin', 'Forgot-pin should be visible to start with.');
      test.assertExists('.cta:disabled', 'Submit button is disabled prior to pin entry');
      this.sendKeys('.pinbox', 'a');
      test.assertVisible('.err-msg', 'Error message should be visible on non-digit input.');
      test.assertNotVisible('.forgot-pin', 'Forgot-pin should not be visible when error is shown.');
      this.sendKeys('.pinbox', '1');
      test.assertNotVisible('.err-msg', 'Error message should be cleared when entering digits after an error being shown.');
      test.assertVisible('.forgot-pin', 'Forgot-pin should be visible when error is hidden');
      this.sendKeys('.pinbox', '234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
    });

    casper.run(function() {
      test.done();
    });
  },
});
