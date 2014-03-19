define(['jquery', 'views/base'], function($, BaseView) {

  var assert = chai.assert;

  suite('Base View Tests', function(){

    test('Check gettext is defined', function(){
      var baseView = new BaseView();
      assert.typeOf(baseView.gettext, 'function');
    });

    test('Check format is defined', function(){
      var baseView = new BaseView();
      assert.typeOf(baseView.format, 'function');
    });

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
