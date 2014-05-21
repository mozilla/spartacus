var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction({statusCode: 500});
  },
});

casper.test.begin('Transaction failure should only have cancel option.', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('START_TRANS_FAILURE');
      test.assertVisible('.button.cta', 'Cancel button should be visible');
      test.assertElementCount('.button', 1, 'Should only be one button for cancelling the flow');

      // Setup success.
      helpers.fakeStartTransaction();
      helpers.fakePinData({pin: true});

      casper.click('.button.cta');
    });

    casper.waitUntilVisible('.throbber', function() {
      test.assertSelectorHasText('.msg', 'Payment Cancelled', 'Check cancelled throbber is displayed');
    });

    casper.run(function() {
      test.done();
    });
  },
});
