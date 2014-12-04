var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/spa/enter-pin',
  useFxA: true,
  fakeFxaSession: true,
  fakeNonMktUser: true,
  fakeFxaEmail: 'foo@<bar>.com',
  setUp: function() {
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
});

casper.test.begin("Check we get to enter-pin and the logout interstitial isn't shown", {

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
