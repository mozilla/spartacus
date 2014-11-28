var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction({timeout: true});
  },
});

casper.test.begin('Start transaction timout, retry then success.', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('TRANS_TIMEOUT');
      test.assertVisible('.full-error .cta', 'CTA button should be visible');
      test.assertVisible('.full-error .cancel', 'Cancel button should be visible');

      // Now setup success.
      helpers.fakeStartTransaction();
      helpers.fakePinData({data: {pin: true}});

      casper.click('.full-error .cta');
    });

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be visible after successful verification');
    });

    casper.run(function() {
      test.done();
    });

  },
});
