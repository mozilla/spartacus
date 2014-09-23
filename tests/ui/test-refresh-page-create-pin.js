var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: false}});
  },
});

casper.test.begin('Refresh from pin creation page.', {

  test: function(test) {
    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {

      // re-load sinon when load.finished fires.
      casper.once('load.finished', function() {
        helpers.injectSinon();
        helpers.fakeVerification();
        helpers.fakePinData({data: {pin: false}});
      });

      casper.reload(function() {
        casper.waitForUrl(helpers.url('create-pin'), function() {
          test.assertUrlMatch(/\/mozpay\/spa\/create-pin/, 'Check we reload into create-pin');
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
