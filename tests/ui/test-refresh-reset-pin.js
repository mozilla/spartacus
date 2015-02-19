helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});

    casper.on('url.changed', function () {
      helpers.injectSinon();
      helpers.fakeLogout();
      helpers.fakeVerification();
      helpers.fakePinData({data: {pin: true}});
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('Refresh from reset-pin page.', {

  test: function(test) {
    helpers.doLogin();

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
      helpers.fakeVerification({reverify: true});
      this.click('#signin');
    });

    casper.waitForUrl(helpers.url('reset-pin'), function() {


      this.reload(function() {
        casper.waitForUrl(helpers.url('enter-pin'), function() {
          test.assertUrlMatch(/\/mozpay\/spa\/enter-pin/, 'Check we reload into enter-pin');
        });

        casper.waitForSelector('.pinbox', function() {
          test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
        });
      });
    });

    casper.run(function() {
      test.done();
    });
  },
});
