define(['jquery', 'views/error'], function($, ErrorView) {

  var assert = chai.assert;

  suite('Error Overlay Tests', function(){

    setup(function(){
      this.error = new ErrorView();
      assert.ok($('#error .full-error').length === 0);
    });

    teardown(function(){
      this.error.close();
    });

    test('Check error overlay appears', function(){
      this.error.render();
      assert.ok($('#error .full-error').length === 1);
    });

    test('Check error overlay is closed', function(){
      this.error.render();
      assert.ok($('#error .full-error').length === 1);
      this.error.close();
      assert.ok($('#error .full-error').length === 0);
    });

    test('Check error overlay page class is set', function(){
      this.error.render({'pageclass': 'full-error whatevs'});
      assert.ok($('#error .page').hasClass('whatevs'));
    });

    test('Check error overlay heading is set', function(){
      this.error.render({'heading': 'wassup'});
      assert.equal($('#error .full-error h1').text(), 'wassup');
    });

    test('Check error overlay msg is set', function(){
      this.error.render({'msg': 'woops'});
      assert.equal($('#error .full-error .message').text(), 'woops');
    });

    test('Check error overlay msg escaping', function(){
      this.error.render({'msg': '<b>woops</b>'});
      assert.include($('#error .full-error .msg').html(), '&lt;b&gt;woops&lt;/b&gt;');
    });

    test('Check render errorCode', function(){
      this.error.render({errorCode: 'PAY_DISABLED'});
      assert.equal($('#error .full-error .message').text(), 'Payments are temporarily disabled.');
      assert.equal($('#error .full-error .error-code').text(), 'PAY_DISABLED');
    });

    test('Check default error on undefined code.', function(){
      this.error.render({errorCode: 'AN_UNUSUAL_ERROR_CODE'});
      assert.equal($('#error .full-error .error-code').text(), 'AN_UNUSUAL_ERROR_CODE');
      assert.equal($('#error .full-error .message').text(), 'An unexpected error occurred.');
    });

    test('Check cancel button defaults to OK.', function(){
      this.error.render({errorCode: 'TESTING_CANCEL_TXT'});
      assert.equal($('button').length, 1);
      assert.ok($('button').hasClass('cancel'));
      assert.ok($('button').hasClass('cta'));
      assert.equal($('button').text(), 'OK');
    });

    test('Check single cancel has cta class when text is changed', function(){
      this.error.render({errorCode: 'TESTING_CANCEL_TXT', cancelText: 'whatever'});
      assert.equal($('button').length, 1);
      assert.ok($('button').hasClass('cancel'));
      assert.ok($('button').hasClass('cta'));
      assert.equal($('button').text(), 'whatever');
    });

    test('Check single cancel has no cta class when CTA is showing', function(){
      this.error.render({errorCode: 'TESTING_CANCEL_TXT', showCta: true});
      assert.equal($('button').length, 2);
      assert.equal($('button.cancel').hasClass('cta'), false);
      assert.equal($('button.cancel').text(), 'Cancel');
    });

    test('cancelCallback is called when cancel button is clicked', function() {
      var spy = sinon.spy();
      this.error.render({errorCode: 'TESTING_CANCEL_TXT', cancelCallback: spy});
      $('.cancel').click();
      assert.ok(spy.calledOnce);
    });

  });
});
