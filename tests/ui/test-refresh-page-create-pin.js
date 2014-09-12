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

      this.reload(function() {
        // New page means we need to set Sinon back up.
        helpers.injectSinon();
        helpers.fakeVerification();
        helpers.fakePinData({data: {pin: false}});

        casper.waitForUrl(helpers.url('create-pin'), function() {
          test.assertUrlMatch(/\/mozpay\/spa\/create-pin/, 'Check we reload into create-pin');
          test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
        });
      });
    });

    casper.run(function() {
      test.done();
    });
  },
});
