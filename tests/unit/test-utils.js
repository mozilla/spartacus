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

  });
});
