define(['chai', 'utils'], function(chai, utils) {

  var assert = chai.assert;
  suite('Utils Tests', function(){

    suite('utils.encodeURIComponent()', function(){
      test('should return foo+bar', function(){
        assert.equal(utils.encodeURIComponent('foo bar'), 'foo+bar');
      });
    });

    suite('utils.decodeURIComponent()', function(){
      test('should return foo bar', function(){
        assert.equal(utils.decodeURIComponent('foo+bar'), 'foo bar');
      });
    });

  });
});
