var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction({simulate: {result: "postback"}});
    helpers.fakeSimulate();
  },
});

casper.test.begin('Simulate success', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('simulate'), function() {
      test.assertVisible('.simulate', 'Simulate page should be displayed');
      this.click('.cta');
    });

    casper.waitForSelector('.full-error', function() {
      // This is due to no native paymentSuccess function. But it does
      // show we've reached the success point in the app.
      // TODO: When a shim is added this will need to be updated.
      helpers.assertErrorCode('NO_PAY_SUCCESS_FUNC');
    });

    casper.run(function() {
      test.done();
    });
  },
});
