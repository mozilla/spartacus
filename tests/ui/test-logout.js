var helpers = require('../helpers');

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

casper.test.begin('Login, then logout and wait for #signin.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertExists('.forgot-pin', 'Forgot-pin should be shown for when you enter your pin.');
      casper.log('Logging out');
      helpers.doLogout();
    });

    casper.then(function() {
      casper.log('Logging back in.');
      helpers.fakeVerification();
      helpers.fakePinData({data: {pin: true}});
    });

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
    });

    casper.run(function() {
      test.done();
    });
  },
});
