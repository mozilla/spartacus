var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification({timeout: true});
    helpers.fakeStartTransaction();
  }
});

casper.test.begin('Timeout verfication, retry then success.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('LOGIN_TIMEOUT');
      test.assertVisible('.button.cta', 'CTA buttons should be visible');
      test.assertVisible('.button.cancel', 'Cancel button should be visible');
      helpers.fakeVerification({statusCode: 200});
      helpers.fakePinData({pin: true});
      casper.click('.button.cta');
    });

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be visible after successful verification');
    });

    casper.run(function() {
      test.done();
    });

  },
});
