helpers.startCasper({
  headers: {
    'Accept-Language': 'fr,fr-fr;q=0.8,en-us;q=0.5,en;q=0.3'
  },
  setUp: function(){
    helpers.fakeLogout();
    helpers.fakeVerification();
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
  },
});

casper.test.begin('Check basic localisation', {
  test: function(test) {

    helpers.doLogin();

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertSelectorHasText('h1', 'Entrez le code PIN');
    });

    casper.run(function() {
      test.done();
    });

  },
});
