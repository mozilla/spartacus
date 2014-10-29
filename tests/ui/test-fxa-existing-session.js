var helpers = require('../helpers');

helpers.startCasper({
  useFxA: true,
  fakeFxaSession: true,
  setUp: function() {
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
    helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 200, url: '/mozpay/v1/api/pin/check/'});
    helpers.fakeWaitPoll({type: 'start'});  // transaction is ready.
  },
});

casper.test.begin('Check we get to enter-pin without login if session exists.', {

  test: function(test) {

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      helpers.assertNoError();
      this.sendKeys('.pinbox', '1234');
      this.click('.cta');
    });

    casper.waitForUrl('/fake-provider', function() {
      casper.echo('FAKE PROVIDER');
    });

    casper.run(function() {
      test.done();
    });
  },
});
