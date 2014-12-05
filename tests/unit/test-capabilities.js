define(['caps'], function(caps) {

  var assert = chai.assert;
  suite('Caps Tests', function(){

    test('test is Firefox for android', function() {
      var ua = 'Mozilla/5.0 (Android; Mobile; rv:33.0) Gecko/33.0 Firefox/33.0';
      assert.equal(caps.isFirefoxAndroid(ua), true);
    });

    test('test is not Firefox for android', function() {
      var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:33.0) Gecko/20100101 Firefox/33.0';
      assert.equal(caps.isFirefoxAndroid(ua), false);
    });

  });
});
