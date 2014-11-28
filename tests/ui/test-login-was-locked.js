var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true, pin_was_locked_out: true}});
  },
});

casper.test.begin('Login then was-locked', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('was-locked'), function() {
      test.assertSelectorHasText('h1', 'Your PIN was locked');
      test.assertNotVisible('.throbber', 'Throbber should not be obscuring was-locked page.');
    });

    casper.run(function() {
      test.done();
    });

  },
});
