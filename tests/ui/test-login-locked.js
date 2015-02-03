helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true, pin_is_locked_out: true}});
  },
});

casper.test.begin('Login then locked', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('locked'), function() {
      helpers.assertErrorCode('PIN_LOCKED');
    });

    casper.run(function() {
      test.done();
    });

  },
});
