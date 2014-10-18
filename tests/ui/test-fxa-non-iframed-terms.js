var helpers = require('../helpers');

helpers.startCasper({
  useFxA: true,
  setUp: function(){
    helpers.fakeFxA();
    casper.on('url.changed', function () {
      helpers.fakeFxA();
      helpers.fakeStartTransaction();
      helpers.fakePinData({data: {pin: false}});
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('Check FxA terms links', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertVisible('.terms', 'Terms and privacy policy urls should be present.');
      casper.click('.tos');
      test.assertDoesntExist('.iframe-overlay', "Check iframe isn't created");
    });

//    casper.waitForPopup('https://marketplace.firefox.com/terms-of-use', function() {
//      casper.echo('Terms opened via window.open');
//    });
//
//    casper.withPopup('https://marketplace.firefox.com/terms-of-use', function() {
//      this.waitForSelector('.site-terms-of-use', function() {
//        this.test.assertExists('.site-terms-of-use', 'Check terms page exists');
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
