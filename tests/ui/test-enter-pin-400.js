var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
    helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 400, url: '/mozpay/v1/api/pin/check/'});
  },
});

casper.test.begin('Enter Pin API call returns 400', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitUntilVisible('.err-msg', function() {
      test.assertVisible('.err-msg', 'Error message should be shown as pin is invalid.');
    });

    casper.run(function() {
      test.done();
    });
  },
});
