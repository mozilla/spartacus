var helpers = require('../helpers');

helpers.startCasper({
  path: '/mozpay/?req=foo&mktuser=false',
  useFxA: true,
  fakeFxaSession: true,
  mktUser: false,
  fakeFxaEmail: 'foo@<bar>.com',
  setUp: function() {
    helpers.fakeStartTransaction();
    helpers.fakePinData({data: {pin: true}});
    helpers.fakePinData({data: {pin: true}, method: 'POST', statusCode: 200, url: '/mozpay/v1/api/pin/check/'});
    helpers.fakeWaitPoll({type: 'start'});  // transaction is ready.
  },
});

casper.test.begin('Check we get to enter-pin if we press continue on the logged-in-state page.', {

  test: function(test) {

    casper.waitForSelector('.signout', function() {
      test.assertVisible('.email', 'Email should be visible');
      test.assertEquals(casper.getHTML('.email'), 'foo@&lt;bar&gt;.com', 'Email should be escaped');
      casper.echo('User hits continue');
      casper.click('.cta');
    });

    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      helpers.assertNoError();
      this.sendKeys('.pinbox', '1234');
      this.click('.cta');
    });

    casper.waitForUrl('/fake-provider', function() {
      casper.echo('FAKE PROVIDER');
    });

    casper.run(function() {
      test.done();
    });
  },
});
