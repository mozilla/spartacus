define(['jquery', 'views/error-overlay'], function($, ErrorOverlay) {

  var assert = chai.assert;

  suite('Base Error Overlay Tests', function(){

    setup(function(){
      this.error = new ErrorOverlay();
    });

    teardown(function(){
      this.error.clear();
    });

    test('Check error overlay appears', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render();
      assert.ok($('#error .full-error').length === 1);
    });

    test('Check error overlay is cleared', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render();
      assert.ok($('#error .full-error').length === 1);
      this.error.clear();
      assert.ok($('#error .full-error').length === 0);
    });

    test('Check error overlay page class is set', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render({'pageclass': 'full-error whatevs'});
      assert.ok($('#error .page').hasClass('whatevs'));
    });

    test('Check error overlay heading is set', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render({'heading': 'wassup'});
      assert.ok($('#error .full-error h1').text('wassap'));
    });

    test('Check error overlay msg is set', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render({'msg': 'woops'});
      assert.ok($('#error .full-error .msg').text('woops'));
    });

    test('Check error overlay msg escaping', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render({'msg': '<b>woops</b>'});
      assert.ok($('#error .full-error .msg').text('&lt;b&gt;woops&lt;/b&gt;'));
    });

  });
});
