var helpers = require('../helpers');


helpers.startCasper({
  useFxA: true,
  setUp: function() {
    helpers.fakeFxA();
    casper.on('url.changed', function () {
      helpers.fakeFxA();
      helpers.fakeStartTransaction();
      helpers.fakePinData({data: {pin: false}});
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('Login test no pin', {

  test: function(test) {

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertDoesntExist('.forgot-pin', 'No forgot-pin should be present for pin creation');
    });

    casper.run(function() {
      test.done();
    });
  },
});
