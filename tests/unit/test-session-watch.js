define([
  'jquery',
  'models/session'
], function($, SessionModel) {

  suite('Session runWatch tests', function() {

    setup(function(){
      this.session = new SessionModel();
      this.session.set('logged_in_user', 'something@test.com');
      this.stub = sinon.stub(this.session, 'runWatch');
    });

    teardown(function(){
      this.stub.restore();
    });

    test('Check that watch gets modified logged_in_user value', function(){
      this.session.set('logged_in_user', 'whatever@test.com');
      this.session.watchIdentity();
      sinon.assert.calledWith(this.stub, sinon.match({loggedInUser: 'whatever@test.com'}));
    });

    test('Check that watch gets correct logged_in_user value', function(){
      this.session.watchIdentity();
      sinon.assert.calledWith(this.stub, sinon.match({loggedInUser: 'something@test.com'}));
    });
  });
});
