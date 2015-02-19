helpers.startCasper({
  sinon: {
    // Process respondWith calls in order.
    consumeStack: true
  },
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
    helpers.fakePinData({data: {pin: true},
                         method: 'POST',
                         statusCode: 200,
                         url: '/mozpay/v1/api/pin/check/'});
    helpers.fakeWaitPoll({type: 'start'});  // transaction is ready.
    helpers.fakeProviderLogout({statusCode: 500});
  },
});

casper.test.begin('Test wait to start polling failed status.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');

      casper.evaluate(function() {
        // Simulate how an old user would already be logged in.
        // This forces a provider logout.
        localStorage.setItem('spa-user', 'old-user');
      });

      this.click('.cta');
    });

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('PROVIDER_LOGOUT_FAIL');
    });

    casper.run(function() {
      test.done();
    });
  },
});
