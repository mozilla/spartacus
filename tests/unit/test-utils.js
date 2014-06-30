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

    test('Test checkURL function with pseudo protocol', function() {
      /* jshint scripturl: true */
      assert.equal(utils.checkURL('javascript:alert("hai")'), false);
    });

    test('test checkURL function with local url (not allowed by default settings as https only)', function() {
      assert.equal(utils.checkURL('/foo'), false);
    });

    test('test checkURL function with bango url (allowed by default settings)', function() {
      assert.equal(utils.checkURL('https://bango.net/foo'), true);
    });

    test('test checkURL function with schemeless url (dis-allowed by default settings)', function() {
      assert.equal(utils.checkURL('//google.com'), false);
    });

    test('test checkURL function with local url (allowed by default settings)', function() {
      assert.equal(utils.checkURL('/foo', {validSchemes: ['http']}), true);
    });

    test('test checkURL function with other domain (allowed by tests settings)', function() {
      assert.equal(utils.checkURL('http://whatever.com', {validSchemes: ['http'], validHosts: ['whatever.com']}), true);
    });

  });
});
