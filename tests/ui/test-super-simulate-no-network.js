helpers.startCasper({
  useFxA: true,
  setUp: function(){
    helpers.fakeFxA({super_powers: true});
    casper.on('url.changed', function () {
      helpers.fakeFxA({super_powers: true});
      helpers.fakeStartTransaction();
      helpers.fakePinData({data: {pin: true}});
      helpers.fakePinData({data: {pin: true}, method: 'POST',
                           statusCode: 200, url: '/mozpay/v1/api/pin/check/'});
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('super user can bypass network simulation', {
  test: function(test) {

    casper.waitForUrl(helpers.url('super-simulate'), function() {
      test.assertVisible('#network-simulation',
                         'network simulation dropdown is visible');
      // Do not select any simulation; continue to a real payment.
      this.click('.cta');
    });

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
      test.assertExists('.cta:disabled', 'Submit button is disabled on click');
    });

    casper.then(function() {
      var request = helpers.getApiRequest('/mozpay/v1/api/pay/');
      var data = JSON.parse(request.requestBody);
      casper.test.assertEqual(data.mcc, undefined);
      casper.test.assertEqual(data.mnc, undefined);
    });

    casper.waitForUrl(helpers.url('wait-to-start'), function() {
      test.assertVisible('.progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
