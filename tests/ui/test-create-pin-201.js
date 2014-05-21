var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({pin: false});
    helpers.fakePinData({pin: true}, 'POST', 201);
  },
});

casper.test.begin('Login successful pin creation.', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
      test.assertExists('.cta:disabled', 'Submit button is disabled prior to pin confirmation');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitForUrl(helpers.url('wait-for-tx'), function() {
      // Throbber should be visible.
      test.assertVisible('progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
