var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({statusCode: 500});
  }
});

casper.test.begin('Make initial pin fetch error, then retry with success.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('PIN_STATE_ERROR');
      test.assertVisible('.full-error .button', 'Cancel button should be visible');
      test.assertElementCount('.full-error .button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.full-error .button');
    });

    casper.waitForSelector('.full-error', function() {
      // This is shown when paymentFailed is called.
      // TODO: This will need updating at the point
      // we have an API on desktop.
      helpers.assertErrorCode('NO_PAY_FAILED_FUNC');
    });

    casper.run(function() {
      test.done();
    });

  },
});
