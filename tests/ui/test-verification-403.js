var helpers = require('../helpers');

var verifyOptions = {statusCode: 403};
helpers.startCasper('/mozpay/', null, verifyOptions);

casper.test.begin('Denied verification should only have cancel option.', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('VERIFICATION_DENIED');
      test.assertVisible('.button.cancel', 'Cancel button should be visible');
      test.assertElementCount('.button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.button');
    });

    casper.waitUntilVisible('.throbber', function() {
      test.assertSelectorHasText('.msg', 'Payment Cancelled', 'Check cancelled throbber is displayed');
    });

    casper.run(function() {
      test.done();
    });

  },
});
