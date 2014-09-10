var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: false}});
    helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 204});
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
      test.assertExists('.cta:disabled', 'Submit button is disabled on click');
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
