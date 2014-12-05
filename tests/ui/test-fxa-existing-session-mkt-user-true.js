var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/spa/enter-pin',
  useFxA: true,
  fakeFxaSession: true,
  mktUser: true,
  fakeFxaEmail: 'foo@<bar>.com',
  setUp: function() {
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
});

casper.test.begin("Check we get to enter-pin and the logout interstitial isn't shown when mkt-user is true", {

  test: function(test) {

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      helpers.assertNoError();
    });

    casper.run(function() {
      test.done();
    });
  },
});
