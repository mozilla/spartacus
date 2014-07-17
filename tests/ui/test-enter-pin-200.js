var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
    helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 200, url: '/mozpay/v1/api/pin/check/'});
  },
});

casper.test.begin('Enter Pin API call returns 200', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitForUrl(helpers.url('wait-to-start'), function() {
      test.assertVisible('.progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
