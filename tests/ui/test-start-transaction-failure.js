var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction({statusCode: 500});
    helpers.spyOnMozPaymentProvider();
  },
});

casper.test.begin('Transaction failure should only have cancel option.', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('TRANS_REQUEST_FAILED');
      test.assertVisible('.full-error .button', 'Cancel button should be visible');
      test.assertElementCount('.full-error .button', 1, 'Should only be one button for cancelling the flow');
      casper.click('.full-error .button');
    });

    helpers.waitForMozPayment(function(mozPayProviderSpy) {
      test.assertEqual(mozPayProviderSpy.paymentFailed.firstCall.args,
                       ['TRANS_REQUEST_FAILED']);
    });

    casper.run(function() {
      test.done();
    });
  },
});
