define([
  'backbone',
  'router',
], function(Backbone, router) {

  var AppRouter = router.AppRouter;
  var opts = { trigger: true, replace: true };

  suite('Routing Tests', function(){

    setup(function () {
      // Stub route methods.
      sinon.stub(AppRouter.prototype, "before");
      sinon.stub(AppRouter.prototype, "after");
      sinon.stub(AppRouter.prototype, "showLogin");

      // Create router with stubs and manual fakes.
      this.router = new AppRouter();
      this.router.root = '/';

      // Start history to enable routes to fire.
      Backbone.history.start();

      // Spy on all route events.
      this.routerSpy = sinon.spy();
      this.router.on("route", this.routerSpy);
    });

    teardown(function () {
      Backbone.history.stop();
      AppRouter.prototype.after.restore();
      AppRouter.prototype.before.restore();
      AppRouter.prototype.showLogin.restore();
    });

    test('Should call before', function(){
      this.router.navigate('/login', opts);
      sinon.assert.calledOnce(AppRouter.prototype.before);
    });

    test('Should call after', function(){
      this.router.navigate('/login', opts);
      sinon.assert.calledOnce(AppRouter.prototype.after);
    });

    test('Should call showLogin', function(){
      this.router.navigate('/login', opts);
      sinon.assert.calledOnce(AppRouter.prototype.showLogin);
    });

  });
});
