helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
});

casper.test.begin('Test forgot pin link leads to reset-start page.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.forgot-pin a', 'Forgot pin link should be visible');
      this.click('.forgot-pin a');
    });

    casper.waitForUrl(helpers.url('reset-start'), function() {
      test.assertVisible('.button.back', 'Back button should be visible');
      this.click('.button.back');
    });

    // Check clicking back takes back to the enter-pin page.
    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.forgot-pin a', 'Forgot pin link should be visible');
    });

    casper.run(function() {
      test.done();
    });
  },
});
