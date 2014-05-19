var helpers = require('../helpers');

var verifyOptions = {statusCode: 500};
helpers.startCasper('/mozpay/', null, verifyOptions);

casper.test.begin('Failed verification, retry and success.', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('LOGIN_FAILED');
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
