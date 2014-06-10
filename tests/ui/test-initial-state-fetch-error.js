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
      test.assertVisible('.button.cta', 'Cancel button should be visible');
      test.assertElementCount('.button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.button.cta');
    });

    casper.waitUntilVisible('.throbber', function() {
      test.assertSelectorHasText('.msg', 'Payment cancelled', 'Check cancelled throbber is displayed');
    });

    casper.run(function() {
      test.done();
    });

  },
});
