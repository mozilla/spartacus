define(['utils'], function(utils) {

  var assert = chai.assert;
  suite('Utils Tests', function(){

    test('encodeURIComponent should return foo+bar', function(){
      assert.equal(utils.encodeURIComponent('foo bar'), 'foo+bar');
    });

    test('decodeURIComponent should return foo bar', function(){
      assert.equal(utils.decodeURIComponent('foo+bar'), 'foo bar');
    });

    test('Check apiUrl ends with correct path', function() {
      assert.equal(utils.apiUrl('/pay/'), '/mozpay/v1/api/pay/');
    });

    test('Check apiUrl ends with correct path with no trailing slash', function() {
      assert.equal(utils.apiUrl('/pay'), '/mozpay/v1/api/pay/');
    });

    test('Check apiUrl ends with correct path with no leading slash', function() {
      assert.equal(utils.apiUrl('pay/'), '/mozpay/v1/api/pay/');
    });

    test('Check apiUrl ends with correct path with no leading or trailing slash', function() {
      assert.equal(utils.apiUrl('pay'), '/mozpay/v1/api/pay/');
    });

    test('Test isValidRedirURL function with pseudo protocol', function() {
      /* jshint scripturl: true */
      assert.equal(utils.isValidRedirURL('javascript:alert("hai")'), false);
    });

    test('test isValidRedirURL function with local url (not allowed by default settings)', function() {
      assert.equal(utils.isValidRedirURL('/foo'), false);
    });

    test('test isValidRedirURL function with bango urls (http+https)', function() {
      assert.equal(utils.isValidRedirURL('http://mozilla.bango.net/foo'), true);
      assert.equal(utils.isValidRedirURL('https://mozilla.bango.net/foo'), true);
    });

    test('test isValidRedirURL function with zippy urls', function() {
      assert.equal(utils.isValidRedirURL('http://zippy.paas.allizom.org', {validRedirSites: ['https://zippy.paas.allizom.org']}), false);
      assert.equal(utils.isValidRedirURL('https://zippy.paas.allizom.org', {validRedirSites: ['https://zippy.paas.allizom.org']}), true);
    });

    test('test isValidRedirURL function with schemeless url (dis-allowed by default settings)', function() {
      assert.equal(utils.isValidRedirURL('//google.com/whatevs.html'), false);
    });

    test('test isValidRedirURL function with local url (allowed by overriden settings)', function() {
      assert.equal(utils.isValidRedirURL('/foo', {validRedirSites: ['http://' + window.location.hostname]}), true);
    });

    test('test isValidRedirURL function with other domain (allowed by override settings)', function() {
      assert.equal(utils.isValidRedirURL('http://whatever.com/foo/bar/baz', {validRedirSites: ['http://whatever.com']}), true);
    });

  });
});
