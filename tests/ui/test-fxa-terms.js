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
      test.assertDoesntExist('.forgot-pin', 'No forgot-pin should be present for pin creation');
      test.assertVisible('.terms', 'Terms and privacy policy urls should be present.');
      this.sendKeys('.pinbox', 's');
      test.assertNotVisible('.terms', 'Terms are removed when error is shown.');
      test.assertVisible('.err-msg', 'Error message should be visible on non-digit input.');
      this.sendKeys('.pinbox', '1');
      test.assertNotVisible('.err-msg', 'Error message should be removed when correct input is given.');
    });

    casper.run(function() {
      test.done();
    });
  },
});
