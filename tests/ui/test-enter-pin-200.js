var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
    helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 200, url: '/mozpay/v1/api/pin/check/'});
  },
});

casper.test.begin('Enter Pin API call returns 200', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '12', {keepFocus: true});
      test.assertNotExists('.cta:enabled', 'Submit button is not enabled');
      // This way of submitting enter is required for the keyCode to be caught.
      // helpers.sendEnterKey doesn't work in this case.
      this.sendKeys('.pinbox', casper.page.event.key.Enter);
    });

    casper.waitUntilVisible('.err-msg', function() {
      test.assertVisible('.err-msg', 'Error message should be visible on too short input.');
      test.assertVisible('.forgot-pin', 'Forgot PIN should be shown on enter-pin screen');
      this.sendKeys('.pinbox', '34');
      test.assertNotVisible('.err-msg', 'Error message should be gone');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
      test.assertExists('.cta:disabled', 'Submit button is disabled on click');
    });

    casper.waitForUrl(helpers.url('wait-to-start'), function() {
      test.assertVisible('.progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
