define([
  'backbone',
  'views/create-pin',
  'views/enter-pin',
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
      'reset-pin': 'showResetPin',
      'reset-start': 'showResetStart',
      'locked': 'showLocked',
      'was-locked': 'showWasLocked',
      'wait-for-tx': 'showWaitForTX',
    },

    showLogin: function() {
      var loginView = new LoginView();
      loginView.render();
    },

    showCreatePin: function() {
      var createPinView = new CreatePinView();
      createPinView.render();
    },

    showEnterPin: function() {
      var enterPinView = new EnterPinView();
      enterPinView.render();
    },

    showResetPin: function() {
      var resetPinView = new ResetPinView();
      resetPinView.render();
    },

    showResetStart: function() {
      var resetStartView = new ResetStartView();
      resetStartView.render();
    },

    showLocked: function() {
      var lockedView = new LockedView();
      lockedView.render();
    },

    showWasLocked: function() {
      var wasLockedView = new WasLockedView();
      wasLockedView.render();
    },

    showWaitForTX: function() {
      var waitView = new WaitView();
      waitView.render();
    },

  });

  return AppRouter;

});
