define([
  'backbone',
  'i18n-abide-utils',
  'jquery',
  'log',
  'underscore',
  'utils',
  'views/create-pin',
  'views/enter-pin',
  'views/locked',
  'views/login',
  'views/reset-pin',
  'views/was-locked',
], function(Backbone, i18n, $, log, _, utils, CreatePinView, EnterPinView, LockedView, LoginView, ResetPinView, WasLockedView){

  'use strict';

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
      if (callback) {
        callback.apply(this, args);
      }
      this.after.apply(this, args);
    },
    before: function(){},
    after: function(){},
  });

  var AppRouter = BaseRouter.extend({
    root: '/mozpay',

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
      // If logged_in state hasn't yet been set we need to prevent
      // routing until it is.
      if (app.user.get('logged_in') === null) {
        console.log('Preventing navigation as logged_in state is unknown.');
        this.navigate('', {replace: true});
        return false;
      }
      // If logged_in state is false then we need to always show the login page.
      // assuming that's not where we already are.
      if (app.user.get('logged_in') === false && Backbone.history.fragment !== 'login') {
        console.log('Not login page and logged_out so navigating to /login');
        this.navigate('/login', {trigger: true});
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

  return {
    AppRouter: AppRouter,
    BaseRouter: BaseRouter
  };

});
