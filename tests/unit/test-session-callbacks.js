define([
  'jquery',
  'utils',
  'models/session'
], function($, utils, SessionModel) {

  var assert = chai.assert;
  var $body = utils.$body;

  suite('Session', function(){

    setup(function(){
      this.oldBodyData = utils.bodyData;
      this.oldLoggedInUser = $body.data('loggedInUser');
      $body.data('loggedInUser', '');
      utils.bodyData = $body.data();
      this.session = new SessionModel();
      this.stub = sinon.stub(this.session, 'trigger');
    });

    teardown(function(){
      utils.bodyData = this.oldBodyData;
      $body.data('loggedInUser', this.oldLoggedInUser);
      this.stub.restore();
    });

    test('Check when onready is called onLogout is fired', function(){
      this.session.runWatch = function(params) {
        params.onready();
      };
      this.session.watchIdentity();
      assert.ok(this.stub.calledWithExactly('onReady'));
      assert.ok(this.stub.calledWithExactly('onLogout'));
    });

    test('Check when onready is called and user is set, impliedLogin is fired', function(){
      $body.data('loggedInUser', 'whatever');
      utils.bodyData = $body.data();
      this.session.runWatch = function(params) {
        params.onready();
      };
      this.session.watchIdentity();
      assert.ok(this.stub.calledWithExactly('onReady'));
      assert.ok(this.stub.calledWithExactly('onImpliedLogin'));
    });

    test('Check onLogin called with assertion', function(){
      $body.data('loggedInUser', 'whatever');
      utils.bodyData = $body.data();
      this.session.runWatch = function(params) {
        params.onlogin('assertion-test');
        params.onready();
      };
      this.session.watchIdentity();
      assert.ok(this.stub.calledWithExactly('onLogin', 'assertion-test'));
      assert.ok(this.stub.calledWithExactly('onReady'));
    });

  });
});
