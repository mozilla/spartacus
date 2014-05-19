var helpers = require('../helpers');

helpers.startCasper({
  setUp: function(){
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({pin: true});
  },
});

casper.test.begin('Enter Pin Widget pin entry is filled', {
  test: function(test) {

    helpers.doLogin();

    casper.waitUntilVisible('.pinbox', function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('#pin', '123');
      casper.capture('tests/captures/pin-widget.png');
      test.assertElementCount('.pinbox .filled', 3, 'Three pin boxes should be filled');
      this.sendKeys('#pin', 'a');
      test.assertVisible('.err-msg', 'Error message should be shown as pin is invalid.');
      this.sendKeys('#pin', '1');
      test.assertElementCount('.pinbox .filled', 4, 'Four pin boxes should be filled');
    });

    casper.run(function() {
      test.done();
    });
  },
});
