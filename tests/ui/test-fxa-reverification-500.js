var helpers = require('../helpers');

helpers.startCasper({
  useFxA: true,
  fakeFxaSession: true,
  setUp: function(){
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
    casper.on('url.changed', function () {
      casper.test.comment('url changed');
      helpers.fakeFxA({statusCode: 500});
      helpers.fakeStartTransaction();
      helpers.fakePinData({data: {pin: true}});
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('Reverification fails with 500 then retry success.', {
  test: function(test) {

    // On enter pin page click forgot pin link.
    casper.waitForUrl(helpers.url('enter-pin'), function() {
      this.click('.forgot-pin a');
    });

    // Then continue...
    casper.waitForUrl(helpers.url('reset-start'), function() {
      helpers.fakeLogout();
      this.click('.button.cta');
    });

    // Click for re-auth...
    casper.waitForSelector('#signin', function() {
      this.click('#signin');
    });

    casper.waitForSelector('.full-error', function() {
      test.assertVisible('.full-error', 'Error page should be shown');
      helpers.assertErrorCode('FXA_FAILED');

      test.assertVisible('.full-error .cta', 'CTA buttons should be visible');
      test.assertVisible('.full-error .cancel', 'Cancel button should be visible');

      helpers.fakeFxA();

      this.click('.full-error .cta');
    });

    casper.waitForUrl(helpers.url('reset-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
    });

    casper.run(function() {
      test.done();
    });
  },
});
