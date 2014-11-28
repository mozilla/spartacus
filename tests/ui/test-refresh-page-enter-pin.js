var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
});

casper.test.begin('Refresh from enter-pin page.', {

  test: function(test) {
    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {

      // Re-load sinon when load.finished fires.
      casper.once('load.finished', function() {
        helpers.injectSinon();
        helpers.fakeLogout();
        helpers.fakeVerification();
        helpers.fakePinData({data: {pin: true}});
      });

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
