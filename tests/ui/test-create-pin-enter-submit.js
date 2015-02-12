var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: false}});
    helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 204});
  },
});

casper.test.begin('Check Create PIN submission on enter', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '12', {keepFocus: true});
      test.assertNotExists('.cta:enabled', 'Submit button is enabled');
      // This way of submitting enter is required for the keyCode to be caught.
      // helpers.sendEnterKey doesn't work in this case.
      this.sendKeys('.pinbox', casper.page.event.key.Enter);
      test.assertVisible('.err-msg', 'Error message should be visible on too short input.');
      test.assertNotVisible('.forgot-pin', 'Forgot PIN should not be shown on create-pin screen');
      this.sendKeys('.pinbox', '34', {keepFocus: true});
      test.assertNotVisible('.err-msg', 'Error message should be gone');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      helpers.sendEnterKey('.pinbox');
    });

    casper.then(function() {
      test.assertExists('.cta:disabled', 'Submit button is disabled prior to pin confirmation');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      helpers.sendEnterKey('.pinbox');
    });

    casper.waitForUrl(helpers.url('wait-to-start'), function() {
      // Throbber should be visible.
      test.assertVisible('.progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
