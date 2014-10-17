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
    casper.evaluate(function() {
      window.open = window._oldOpen;
    });
  }
});

casper.test.begin('Check iframed FxA privacy link', {

  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertVisible('.terms', 'Terms and privacy policy urls should be present.');

      casper.evaluate(function() {
        window._oldOpen = window.open;
        window.open = function(){
          return false;
        };
      });

      casper.click('.pp');
    });

    casper.waitForSelector('.iframe-overlay', function() {
      casper.echo(casper.getElementAttribute('.iframe-overlay iframe', 'src'));
      test.assertMatch(
        casper.getElementAttribute('.iframe-overlay iframe', 'src'),
        /privacy\/en-US\.html/,
        'Check privacy src attr set ok'
      );
      test.assertVisible('.iframe-overlay iframe[sandbox=""]', 'Check iframe has sandbox attr set');
      test.assertEqual(
        casper.getElementAttribute('.iframe-overlay iframe', 'security'),
        'restricted',
        'Check terms security attr set to "restricted"'
      );
      casper.click('.iframe-overlay .cta');
    });

    casper.waitWhileSelector('.iframe-overlay', function() {
      test.assertNotVisible('.iframe-overlay iframe', 'Check overlay is removed');
    });

    casper.run(function() {
      test.done();
    });
  },
});
