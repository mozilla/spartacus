define([
  'jquery',
  'models/session'
], function($, SessionModel) {

  var assert = chai.assert;

  suite('Session', function(){

    setup(function(){
      this.session = new SessionModel();
      this.session.set('logged_in_user', '');
      this.stub = sinon.stub(this.session, 'trigger');
    });

    teardown(function(){
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
      this.session.set('logged_in_user', 'whatever');
      this.session.runWatch = function(params) {
        params.onready();
      };
      this.session.watchIdentity();
      assert.ok(this.stub.calledWithExactly('onReady'));
      assert.ok(this.stub.calledWithExactly('onImpliedLogin'));
    });

    test('Check onLogin called with assertion', function(){
      this.session.set('logged_in_user', 'whatever');
      this.session.runWatch = function(params) {
        params.onlogin('assertion-test');
        params.onready();
      };
      this.session.watchIdentity();
      assert.ok(this.stub.calledWithExactly('onLogin', 'assertion-test'));
      assert.ok(this.stub.calledWithExactly('onReady'));
    });

    test('Check onLogout clears logged_in_user', function(){
      this.session.set('logged_in_user', 'whatever');
      this.session.runWatch = function(params) {
        params.onlogout();
      };
      assert.equal(this.session.get('logged_in_user'), 'whatever');
      this.session.watchIdentity();
      assert.ok(this.stub.calledWithExactly('onLogout'));
      assert.equal(this.session.get('logged_in_user'), '');
    });
  });
});
