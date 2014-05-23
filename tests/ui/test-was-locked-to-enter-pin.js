var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true, pin_was_locked_out: true}});
  },
});

casper.test.begin('Test was-locked -> enter-pin', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('was-locked'), function() {
      test.assertVisible('.button.cta', 'CTA button should be shown');
      test.assertVisible('.button.reset-start', 'Reset pin button should be visible');
      casper.click('.button.cta');
    });

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
    });

    casper.run(function() {
      test.done();
    });

  },
});
