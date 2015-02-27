helpers.startCasper({
  userAgent: 'firefox-os',
  useFxA: true,
  setUp: function(){
    helpers.fakeFxA({statusCode: 403, data: ''});
    casper.on('url.changed', function () {
      // Signal that the server rejected the FxA login token.
      helpers.fakeFxA({statusCode: 403, data: ''});
      helpers.spyOnMozPaymentProvider();
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('Denied verification should only have cancel option.', {

  test: function(test) {

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('FXA_DENIED');
      test.assertElementCount('.full-error .button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.full-error .button');
      helpers.assertPaymentFailed(['FXA_DENIED']);
    });

    casper.run(function() {
      test.done();
    });

  },
});
