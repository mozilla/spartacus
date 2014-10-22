var helpers = require('../helpers');

helpers.startCasper({
  useFxA: true,
  fakeFxaSession: true,
  setUp: function() {
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: false}});
  }
});

casper.test.begin('Check we get to enter-pin without login if session exists.', {
  test: function(test) {

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
    });

    casper.run(function() {
      test.done();
    });
  },
});
