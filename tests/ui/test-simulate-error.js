helpers.startCasper({
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction({simulate: {result: "postback"}});
    helpers.fakeSimulate({statusCode: 500});
  },
});

casper.test.begin('Simulate failure', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('simulate'), function() {
      test.assertVisible('.simulate', 'Simulate page should be displayed');
      this.click('.cta');
    });

    casper.waitForSelector('.full-error', function() {
      helpers.assertErrorCode('SIMULATE_FAIL');
    });

    casper.run(function() {
      test.done();
    });
  },
});
