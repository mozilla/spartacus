helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: false}});
  },
});

casper.test.begin('Test error messages when user has no pin yet.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertDoesntExist('.forgot-pin', 'No forgot-pin should be present for pin creation');
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertExists('.cta:disabled', 'Submit button is disabled prior to pin entry');
      this.sendKeys('.pinbox', 'a');
      test.assertVisible('.err-msg', 'Error message should be visible on non-digit input.');
      this.sendKeys('.pinbox', '1');
      test.assertNotVisible('.err-msg', 'Error message should be cleared when entering digits after an error being shown.');
      this.sendKeys('.pinbox', '234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
    });

    casper.run(function() {
      test.done();
    });
  },
});
