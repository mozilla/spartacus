define(['jquery', 'chai', 'views/base'], function($, chai, BaseView) {

  var assert = chai.assert;

  suite('Base View Tests', function(){

    suite('BaseView.gettext', function(){
      test('gettext is defined', function(){
        var baseView = new BaseView();
        assert.typeOf(baseView.gettext, 'function');
      });
    });

    suite('BaseView.setTitle', function(){
      test('title can be changed with setTitle', function(){
        var baseView = new BaseView();
        assert.typeOf(baseView.setTitle, 'function');
        var oldTitle = baseView.$('title').text();
        baseView.setTitle('foo');
        assert.equal($('title').text(), 'Webpay | foo');
        $('title').text(oldTitle);
      });
    });

    suite('Nunjucks Escaping', function(){
      test('Content should be escaped by default.', function(){
        var baseView = new BaseView();
        assert.typeOf(baseView.template, 'function');
        var scriptContent = '<script>alert("oh hai")</script>';
        var rendered = baseView.template('base-error.html', {msg: scriptContent});
        assert.notInclude(rendered, scriptContent);
        assert.include(rendered, '&lt;script&gt;');
      });
    });
  });
});
