define(['jquery', 'models/user'], function($, UserModel) {

  var assert = chai.assert;

  suite('User Model Tests', function(){

    test('Check gettext is defined', function(){
      var userModel = new UserModel();
      assert.typeOf(userModel.gettext, 'function');
    });

    test('Check pin url is built correctly', function(){
      var userModel = new UserModel();
      var pinURL = userModel.url;
      assert.equal(pinURL, window.location.origin + '/mozpay/v1/api/pin/');
    });

    test('Check pin check url is built correctly', function(){
      var userModel = new UserModel();
      var checkURL = userModel.checkURL;
      assert.equal(checkURL, window.location.origin + '/mozpay/v1/api/pin/check/');
    });

    test('Check pay url is built correctly', function(){
      var userModel = new UserModel();
      var payURL = userModel.payURL;
      assert.equal(payURL, window.location.origin + '/mozpay/v1/api/pay/');
    });


  });
});
