var termsUrlRx = /\/media\/docs\/terms\/en-US\.html\?20131014-4/;

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

casper.test.begin('Check iframed FxA terms link', {

  test: function(test) {

    casper.waitForUrl(helpers.url('create-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      test.assertVisible('.terms', 'Terms and privacy policy urls should be present.');

      casper.evaluate(function() {
        window._oldOpen = window.open;
        window.open = function(){
          return false;
        };
      });

      casper.click('.tos');
    });

    casper.waitForSelector('.iframe-overlay', function() {
      test.assertMatch(
        casper.getElementAttribute('.iframe-overlay iframe', 'src'),
        termsUrlRx,
        'Check terms src attr set ok'
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
      casper.click('.pinbox');
      casper.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      casper.click('.cta');
      casper.click('.tos');
    });

    casper.waitForSelector('.iframe-overlay', function() {
      // Check that the link works on the confirm pin page.
      test.assertMatch(
        casper.getElementAttribute('.iframe-overlay iframe', 'src'),
        termsUrlRx,
        'Check terms src attr set ok'
      );
    });

    casper.run(function() {
      test.done();
    });
  },
});
