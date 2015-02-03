helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
    helpers.fakePinData({timeout:true, method: 'POST', url:'/mozpay/v1/api/pin/check/'});
  },
});

casper.test.begin('Enter pin timeout then success', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('PIN_ENTER_TIMEOUT');
      test.assertVisible('.full-error .cta', 'CTA buttons should be visible');
      test.assertVisible('.full-error .cancel', 'Cancel button should be visible');
      helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 200, url:'/mozpay/v1/api/pin/check/'});
      this.click('.full-error .cta');
    });

    casper.waitForUrl(helpers.url('wait-to-start'), function() {
      test.assertVisible('.progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
