define([
  'backbone',
  'views/create-pin',
  'views/enter-pin',
  'views/force-auth',
  'views/locked',
  'views/login',
  'views/reset-pin',
  'views/reset-start',
  'views/wait-for-tx',
  'views/was-locked'
], function(
  Backbone,
  CreatePinView,
  EnterPinView,
  ForceAuthView,
  LockedView,
  LoginView,
  ResetPinView,
  ResetStartView,
  WaitView,
  WasLockedView
){

  'use strict';

  var AppRouter = Backbone.Router.extend({
    root: '/mozpay/spa',

    routes: {
      '': 'showIndex',
      'login': 'showLogin',
      'create-pin': 'showCreatePin',
      'enter-pin': 'showEnterPin',
      'force-auth': 'showForceAuth',
      'reset-pin': 'showResetPin',
      'reset-start': 'showResetStart',
      'locked': 'showLocked',
      'was-locked': 'showWasLocked',
      'wait-for-tx': 'showWaitForTX',
    },

    showCreatePin: function() {
      var createPinView = new CreatePinView();
      createPinView.render();
    },

    showEnterPin: function() {
      var enterPinView = new EnterPinView();
      enterPinView.render();
    },

    showForceAuth: function() {
      var forceAuthView = new ForceAuthView();
      forceAuthView.render();
    },

    showLocked: function() {
      var lockedView = new LockedView();
      lockedView.render();
    },

    showLogin: function() {
      var loginView = new LoginView();
      loginView.render();
    },

    showResetPin: function() {
      var resetPinView = new ResetPinView();
      resetPinView.render();
    },

    showResetStart: function() {
      var resetStartView = new ResetStartView();
      resetStartView.render();
    },

    showWaitForTX: function() {
      var waitView = new WaitView();
      waitView.render();
    },

    showWasLocked: function() {
      var wasLockedView = new WasLockedView();
      wasLockedView.render();
    },

  });

  return AppRouter;

});
