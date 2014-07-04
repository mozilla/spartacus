define(['jquery', 'views/error'], function($, ErrorView) {

  var assert = chai.assert;

  suite('Error Overlay Tests', function(){

    setup(function(){
      this.error = new ErrorView();
    });

    teardown(function(){
      this.error.close();
    });

    test('Check error overlay appears', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render();
      assert.ok($('#error .full-error').length === 1);
    });

    test('Check error overlay is closed', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render();
      assert.ok($('#error .full-error').length === 1);
      this.error.close();
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
      assert.equal($('#error .full-error h1').text(), 'wassup');
    });

    test('Check error overlay msg is set', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render({'msg': 'woops'});
      assert.equal($('#error .full-error .message').text(), 'woops');
    });

    test('Check error overlay msg escaping', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render({'msg': '<b>woops</b>'});
      assert.include($('#error .full-error .msg').html(), '&lt;b&gt;woops&lt;/b&gt;');
    });

    test('Check render errorCode', function(){
      assert.ok($('#error .full-error').length === 0);
      this.error.render({errorCode: 'MISSING_JWT'});
      assert.equal($('#error .full-error .message').text(), 'The JWT signature is missing or invalid.');
      assert.equal($('#error .full-error .error-code').text(), 'MISSING_JWT');
    });

  });
});
