var helpers = require('../helpers');

helpers.startCasper({
  useFxA: true,
  setUp: function(){
    helpers.fakeFxA();
    helpers.fakeStartTransaction();
    casper.on('url.changed', function () {
      helpers.fakeFxA();
      helpers.fakePinData({data: {pin: false}});
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('Check FxA privacy policy link', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertVisible('.terms', 'Terms and privacy policy urls should be present.');
      casper.click('.pp');
      test.assertDoesntExist('.iframe-overlay', "Check iframe isn't created");
    });

//    casper.waitForPopup('https://marketplace.firefox.com/privacy-policy', function() {
//      casper.echo('Privacy policy opened via window.open');
//    });
//
//    casper.withPopup('https://marketplace.firefox.com/privacy-policy', function() {
//      this.waitForSelector('.site-privacy-policy', function() {
//        this.test.assertExists('.site-privacy-policy', 'Check privacy page exists');
//        this.evaluate(function() {
//          window.close();
//        });
//      });
//    });

    casper.run(function() {
      test.done();
    });
  },
});
