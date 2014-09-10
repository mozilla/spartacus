var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification({timeout: true});
    helpers.fakeStartTransaction();
  }
});

casper.test.begin('Make initial pin fetch error, then retry with success.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('VERIFY_TIMEOUT');
      test.assertVisible('.full-error .cta', 'CTA buttons should be visible');
      test.assertVisible('.full-error .cancel', 'Cancel button should be visible');

      // Setup success.
      helpers.fakeVerification();
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
