helpers.startCasper({
  useFxA: true,
  fakeFxaSession: true,
  mktUser: false,
  setUp: function() {
    casper.on('url.changed', function () {
      helpers.fakeFxA();
      helpers.fakeStartTransaction();
      helpers.fakePinData({data: {pin: true}});
      helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 200, url: '/mozpay/v1/api/pin/check/'});
      helpers.fakeWaitPoll({type: 'start'});  // transaction is ready.
      helpers.fakeProviderLogout();
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('Check we get to enter-pin after logout from logged-in-state view.', {

  test: function(test) {

    casper.waitForSelector('.signout', function() {
      test.assertVisible('.email', 'Email should be visible');
      test.assertSelectorHasText('.email', 'foo@bar.com');
      casper.echo('User hit "Not you?" link to logout');
      casper.click('.logout');
      helpers.fakeLogout();
    });

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      helpers.assertNoError();
      this.sendKeys('.pinbox', '1234');
      this.click('.cta');
    });

    casper.waitForUrl('/fake-provider', function() {
      casper.echo('FAKE PROVIDER');
    });

    casper.run(function() {
      test.done();
    });
  },
});
