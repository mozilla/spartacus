var helpers = require('../helpers');

helpers.startCasper({
  useFxA: true,
  setUp: function(){
    helpers.fakeFxA({statusCode: 403, data: ''});
    casper.on('url.changed', function () {
      // Signal that the server rejected the FxA login token.
      helpers.fakeFxA({statusCode: 403, data: ''});
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('Denied verification should only have cancel option.', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('FXA_DENIED');
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
