helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: false}});
    helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 204});
    helpers.fakeWaitPoll({type: 'start', statusData: 3});
  },
});

casper.test.begin('Check Create PIN submission on enter', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '12', {keepFocus: true});
      test.assertNotExists('.cta:enabled', 'Submit button is enabled');
      helpers.sendEnterKey('#pin');
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
