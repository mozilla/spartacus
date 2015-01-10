define([
  'backbone',
  'log',
  'underscore',
  'utils',
  'views/create-pin',
  'views/enter-pin',
  'views/force-auth',
  'views/fxa-authorize',
  'views/init',
  'views/locked',
  'views/logged-in-state',
  'views/payment-failed',
  'views/payment-success',
  'views/reset-pin',
  'views/reset-start',
  'views/simulate',
  'views/wait-to-finish',
  'views/wait-to-start',
  'views/was-locked'
], function(
  Backbone,
  log,
  _,
  utils,
  CreatePinView,
  EnterPinView,
  ForceAuthView,
  FxAAuthView,
  InitView,
  LockedView,
  LoggedInStateView,
  PaymentFailedView,
  PaymentSuccessView,
  ResetPinView,
  ResetStartView,
  SimulateView,
  WaitToFinishView,
  WaitToStartView,
  WasLockedView
) {

  'use strict';

  var logger = log('router');
  var AppRouter = Backbone.Router.extend({

    root: '/mozpay',

    routes: {
      '': 'showInit',
      'spa/create-pin': 'showCreatePin',
      'spa/enter-pin': 'showEnterPin',
      'spa/reset-pin': 'showResetPin',
      'spa/reset-start': 'showResetStart',
      'spa/simulate': 'showSimulate',
      'spa/locked': 'showLocked',
      'spa/was-locked': 'showWasLocked',
      'spa/wait-to-start': 'showWaitToStart',
    },

    // This mapping provides a key for data attrs.
    // only routes listed here are available to be
    // mapped to from data attrs.
    mapping: {
      'wait-to-finish': 'showWaitToFinish',
      'payment-failed': 'showPaymentFailed',
      'payment-success': 'showPaymentSuccess',
    },

    getMappedRouteFunc: function(key) {
      var mapping = this.mapping;
      if (mapping[key]) {
        // Bind 'this' to the router.
        return _.bind(this[mapping[key]], this);
      } else {
        logger.error('No route mapped for key: ' + key);
        throw new Error('NO_MAPPED_ROUTE');
      }
    },

    initialize: function(options){
      this.viewManager = new options.ViewManager();
      this.app = options.app;
    },

    finishFxALogin: function () {
      // Not routed, since routing happens after login.
      this.viewManager.renderView(FxAAuthView);
    },

    showInit: function() {
      // Doesn't have a URL so no calls to navigate.
      this.viewManager.renderView(InitView);
    },

    showCreatePin: function() {
      this.navigate('spa/create-pin');
      this.viewManager.renderView(CreatePinView);
    },

    showEnterPin: function() {
      this.navigate('spa/enter-pin');
      this.viewManager.renderView(EnterPinView);
    },

    showForceAuth: function() {
      // Doesn't have a URL so no calls to navigate.
      this.viewManager.renderView(ForceAuthView);
    },

    showLocked: function() {
      this.navigate('spa/locked');
      this.viewManager.renderView(LockedView);
    },

    showLoggedInState: function() {
      // Doesn't have a URL so no calls to navigate.
      this.viewManager.renderView(LoggedInStateView);
    },

    showPaymentFailed: function() {
      // Doesn't have a URL so no calls to navigate.
      this.viewManager.renderView(PaymentFailedView);
    },

    showPaymentSuccess: function() {
      // Doesn't have a URL so no calls to navigate.
      this.viewManager.renderView(PaymentSuccessView);
    },

    showResetPin: function() {
      this.navigate('spa/reset-pin');
      this.viewManager.renderView(ResetPinView);
    },

    showResetStart: function() {
      this.navigate('spa/reset-start');
      this.viewManager.renderView(ResetStartView);
    },

    showSimulate: function() {
      this.navigate('spa/simulate');
      this.viewManager.renderView(SimulateView);
    },

    showWaitToFinish: function() {
      this.navigate('spa/wait-to-finish');
      this.viewManager.renderView(WaitToFinishView);
    },

    showWaitToStart: function() {
      this.navigate('spa/wait-to-start');
      this.viewManager.renderView(WaitToStartView);
    },

    showWasLocked: function() {
      this.navigate('spa/was-locked');
      this.viewManager.renderView(WasLockedView);
    },

  });

  return AppRouter;

});
