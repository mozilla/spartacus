define([
  'jquery',
  'underscore',
  'backbone',
  'i18n-abide-utils',
  'log',
  'utils',
  'views/login',
  'views/create-pin',
  'views/enter-pin',
  'views/reset-pin',
  'views/locked',
  'views/was-locked',
], function($, _, Backbone, i18n, log, utils, LoginView, CreatePinView, EnterPinView, ResetPinView, LockedView, WasLockedView){

  var console = log('router');

  /*
   * BaseRouter allows conditionally to run a before
   * route function.
   */
  var BaseRouter = Backbone.Router.extend({

    // Execute happens when ever a route is matched
    // but before the callback is run.
    execute: function(callback, args) {
      var result = this.before.apply(this, args);
      // If `before()` returns false return false to prevent
      // the route from happening.
      if (result === false) {
        return false;
      }
      callback && callback.apply(this, args);
      this.after.apply(this, args);
    },
    before: function(){},
    after: function(){},
  });

  var AppRouter = BaseRouter.extend({

    routes: {
      '': 'showIndex',
      'login': 'showLogin',
      'create-pin': 'showCreatePin',
      'enter-pin': 'showEnterPin',
      'reset-pin': 'showResetPin',
      'locked': 'showLocked',
      'was-locked': 'showWasLocked',
    },

    before: function() {
      if (app.user.get('logged_in') !== true && Backbone.history.fragment !== 'login') {
        console.log('Checking auth as logged_in state is unknown and not login view.');
        app.user.checkAuth();
        return false;
      }
    },

    showLogin: function() {
      var loginView = new LoginView({
        model: app.user
      });
      loginView.render();
    },

    showCreatePin: function() {
      var createPinView = new CreatePinView();
      createPinView.render();
    },

    showEnterPin: function() {
      var enterPinView = new EnterPinView({
        model: app.user
      });
      enterPinView.render();
    },

    showResetPin: function() {
      var resetPinView = new ResetPinView();
      resetPinView.render();
    },

    showLocked: function() {
      var lockedView = new LockedView();
      lockedView.render();
    },

    showWasLocked: function() {
      var wasLockedView = new WasLockedView();
      wasLockedView.render();
    },

  });

  return AppRouter;
});
