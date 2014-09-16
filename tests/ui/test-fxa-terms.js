var helpers = require('../helpers');

helpers.startCasper({
  useFxA: true,
  setUp: function(){
    helpers.fakeFxA();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: false}});
  }
});

casper.test.begin('Check FxA terms links', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertDoesntExist('.forgot-pin', 'No forgot-pin should be present for pin creation');
      test.assertVisible('.terms', 'Terms and privacy policy urls should be present.');
      this.sendKeys('.pinbox', '1');
      test.assertNotVisible('.terms', 'Terms are removed when first char is entered');
    });

    casper.run(function() {
      test.done();
    });
  },
});
