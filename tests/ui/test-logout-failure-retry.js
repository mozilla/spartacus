helpers.startCasper({
  onLoadFinished: function() {
    casper.evaluate(function() {
      document.body.setAttribute('data-logged-in-user', 'whatever');
    });
  },
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
  tearDown: function() {
    casper.evaluate(function() {
      document.body.setAttribute('data-logged-in-user', '');
    });
  }
});

casper.test.begin('Login, then logout (which will fail) and retry', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertExists('.forgot-pin', 'Forgot-pin should be shown for when you enter your pin.');
      helpers.fakeLogout({statusCode: 500});
      helpers.doLogout();
    });

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('LOGOUT_FAILED');
      helpers.fakeLogout();
      casper.click('.full-error .cta');
    });

    casper.waitForSelector('#signin', function() {
      test.assertVisible('#signin', 'Signin should be visible');
    });

    casper.run(function() {
      test.done();
    });
  },
});
