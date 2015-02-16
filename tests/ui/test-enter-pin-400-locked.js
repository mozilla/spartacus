helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.spyOnMozPaymentProvider();
    helpers.fakePinData({data: {pin: true}});
    helpers.fakePinData({data: {pin: true, pin_is_locked_out: true}, method: 'POST', statusCode: 400, url: '/mozpay/v1/api/pin/check/'});
  },
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
      test.assertElementCount('.locked .button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.locked .button');
      helpers.assertPaymentFailed(['PIN_LOCKED']);
    });

    casper.run(function() {
      test.done();
    });
  },
});
