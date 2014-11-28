var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification({statusCode: 500});
    helpers.fakeStartTransaction();
  },
});

casper.test.begin('Failed verification, retry and success.', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('VERIFY_FAILED');
      test.assertVisible('.full-error .cta', 'CTA buttons should be visible');
      test.assertVisible('.full-error .cancel', 'Cancel button should be visible');

      // Setup success.
      helpers.fakeVerification({statusCode: 200});
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
