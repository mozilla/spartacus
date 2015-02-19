helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction({simulate: {result: "postback"}});
    helpers.fakeSimulate({timeout: true});
  },
});

casper.test.begin('Simulate timeout', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('simulate'), function() {
      test.assertVisible('.simulate', 'Simulate page should be displayed');
      this.click('.cta');
    });

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('SIMULATE_TIMEOUT');
    });

    casper.run(function() {
      test.done();
    });
  },
});
