var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
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
        // New page means we need to set Sinon back up.
        helpers.injectSinon();
        helpers.fakeVerification();
        helpers.fakePinData({data: {pin: true}});
      });

      casper.then(function() {
        casper.waitForUrl(helpers.url('enter-pin'), function() {
          test.assertUrlMatch(/\/mozpay\/spa\/enter-pin/, 'Check we reload into enter-pin');
          test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
        });
      });
    });

    casper.run(function() {
      test.done();
    });
  },
});
