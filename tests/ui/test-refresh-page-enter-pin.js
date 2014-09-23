var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
});

casper.test.begin('Refresh from enter-pin page.', {

  test: function(test) {
    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {

      this.reload(function() {
        // New page means we need to set Sinon back up.
        helpers.injectSinon();
        helpers.fakeVerification();
        helpers.fakePinData({data: {pin: true}});
      });

      casper.then(function() {
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
