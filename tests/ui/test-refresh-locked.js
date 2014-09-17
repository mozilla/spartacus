var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true, pin_is_locked_out: true}});
  },
});

casper.test.begin('Refresh from locked page.', {

  test: function(test) {
    helpers.doLogin();

    casper.waitForUrl(helpers.url('locked'), function() {

      helpers.assertErrorCode('PIN_LOCKED');

      this.reload(function() {
        // New page means we need to set Sinon back up.
        helpers.injectSinon();
        helpers.fakeVerification();
        helpers.fakePinData({data: {pin: true, pin_is_locked_out: true}});
      });

      casper.then(function() {
        casper.waitForUrl(helpers.url('locked'), function() {
          test.assertUrlMatch(/\/mozpay\/spa\/locked/, 'Check we reload into the locked page');
          helpers.assertErrorCode('PIN_LOCKED');
        });
      });
    });

    casper.run(function() {
      test.done();
    });
  },
});
