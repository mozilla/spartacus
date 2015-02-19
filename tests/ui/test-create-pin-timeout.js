helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: false}});
    helpers.fakePinData({timeout: true, method: 'POST'});
  },
});

casper.test.begin('Create pin timeout then success.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
      test.assertExists('.cta:disabled', 'Submit button is disabled prior to pin confirmation');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('PIN_CREATE_TIMEOUT');
      test.assertVisible('.full-error .cta', 'CTA buttons should be visible');
      test.assertVisible('.full-error .cancel', 'Cancel button should be visible');
      helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 204});
      this.click('.full-error .cta');
    });

    casper.waitForUrl(helpers.url('wait-to-start'), function() {
      // Throbber should be visible.
      test.assertVisible('.progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
