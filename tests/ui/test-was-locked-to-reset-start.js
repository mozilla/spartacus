var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true, pin_was_locked_out: true}});
  },
});

casper.test.begin('Test was-locked -> reset-start', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('was-locked'), function() {
      test.assertVisible('.button.cta', 'CTA button should be shown');
      test.assertVisible('.button.reset-start', 'Reset pin button should be visible');
      casper.click('.button.reset-start');
    });

    casper.waitForUrl(helpers.url('reset-start'), function() {
      test.assertVisible('.reset-start', 'Reset start content should be visible.');
    });

    casper.run(function() {
      test.done();
    });

  },
});
