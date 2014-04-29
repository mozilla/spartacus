var helpers = require('../helpers');

console.log(helpers.startCasper);

helpers.startCasper('/mozpay', function(){
  helpers.fakePinData({pin: false});
});


casper.test.begin('Login test no pin', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl('/mozpay/create-pin', function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertExists('.cta:disabled', 'Submit button is disabled prior to pin entry');
      this.sendKeys('.pinbox', 'a');
      test.assertVisible('.err-msg', 'Error message should be visible on non-digit input.');
      this.sendKeys('.pinbox', '1');
      test.assertNotVisible('.err-msg', 'Error message should be cleared when entering digits after an error being shown.');
      this.sendKeys('.pinbox', '234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
    });

    casper.run(function() {
      test.done();
    });
  },
});
