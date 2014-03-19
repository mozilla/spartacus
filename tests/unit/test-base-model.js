define(['jquery', 'models/base'], function($, BaseModel) {

  var assert = chai.assert;

  suite('Base Model Tests', function(){

    test('Check gettext is defined', function(){
      var baseModel = new BaseModel();
      assert.typeOf(baseModel.gettext, 'function');
    });

  });
});
