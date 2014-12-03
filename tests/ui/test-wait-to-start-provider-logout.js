var helpers = require('../helpers');

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
    helpers.fakeProviderLogout();
  },
});

casper.test.begin('Test wait to start polling', {
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

    casper.waitForUrl('/fake-provider', function() {
      // This is just a check to make sure we are redirected correctly to the
      // provided url when the transaction state changes to pending.
      casper.echo('FAKE PROVIDER');
    });

    casper.run(function() {
      test.done();
    });
  },
});
