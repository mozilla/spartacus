var helpers = require('../helpers');


helpers.startCasper({
  useFxA: true,
  path: '/mozpay/?req=foo&test-fxa=1',
  setUp: function(){
    helpers.fakeFxA(200);
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: false}});
  },
});

casper.test.begin('Login test no pin', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertDoesntExist('.forgot-pin', 'No forgot-pin should be present for pin creation');
    });

    casper.run(function() {
      test.done();
    });
  },
});
