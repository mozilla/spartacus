var helpers = require('../helpers');
var expectedMCC = '334';
var expectedMNC = '020';

helpers.startCasper({
  useFxA: true,
  fakeFxaSession: true,
  fakeFxaEmail: 'foo@<bar>.com',
  setUp: function(){
    casper.evaluate(function() {
      document.body.setAttribute('data-super-powers', 'true');
    });
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
    helpers.fakePinData({data: {pin: true}, method: 'POST',
                         statusCode: 200, url: '/mozpay/v1/api/pin/check/'});
  },
});

casper.test.begin('already logged in super user can see simulation screen', {
  test: function(test) {
    casper.waitForUrl(helpers.url('super-simulate'), function() {
      test.assert(true);
    });

    casper.run(function() {
      test.done();
    });
  },
});
