define([
  'backbone',
  'underscore',
  'utils',
  'views/create-pin',
  'views/enter-pin',
  'views/force-auth',
  'views/fxa-login',
  'views/init',
  'views/locked',
  'views/login',
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
  _,
  utils,
  CreatePinView,
  EnterPinView,
  ForceAuthView,
  FxALoginView,
  InitView,
  LockedView,
  LoginView,
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

  var AppRouter = Backbone.Router.extend({

    root: '/mozpay',

    routes: {
      '': 'showInit',
      'spa/create-pin': 'showCreatePin',
      'spa/enter-pin': 'showEnterPin',
      'spa/force-auth': 'showForceAuth',
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
        console.error('No route mapped for key: ' + key);
        throw new Error('NO_MAPPED_ROUTE');
      }
    },

    initialize: function(options){
      this.viewManager = new options.ViewManager();
      this.app = options.app;
    },

    current: function () {
      // Based on a snippet from http://stackoverflow.com/questions/7563949/backbone-js-get-current-route
      var fragment = Backbone.history.fragment;
      var routes = _.pairs(this.routes);
      var route;
      var name;
      var found;

      found = _.find(routes, function (namedRoute) {
        route = namedRoute[0];
        name = namedRoute[1];
        if (!_.isRegExp(route)) {
          route = this._routeToRegExp(route);
        }
        return route.test(fragment);
      }, this);

      if (found) {
        return {
          name: name,
          params: this._extractParameters(route, fragment),
          fragment: fragment
        };
      }
    },

    showInit: function() {
      this.viewManager.renderView(InitView);
    },

    showCreatePin: function() {
      this.viewManager.renderView(CreatePinView);
    },

    showEnterPin: function() {
      this.viewManager.renderView(EnterPinView);
    },

    showForceAuth: function() {
      this.viewManager.renderView(ForceAuthView);
    },

    showLocked: function() {
      this.viewManager.renderView(LockedView);
    },

    showLogin: function() {
      // Note: This view isn't directly routed.
      if (utils.bodyData.fxaUrl) {
        this.viewManager.renderView(FxALoginView);
      } else {
        this.viewManager.renderView(LoginView);
      }
    },

    showPaymentFailed: function() {
      this.viewManager.renderView(PaymentFailedView);
    },

    showPaymentSuccess: function() {
      this.viewManager.renderView(PaymentSuccessView);
    },

    showResetPin: function() {
      this.viewManager.renderView(ResetPinView);
    },

    showResetStart: function() {
      this.viewManager.renderView(ResetStartView);
    },

    showSimulate: function() {
      this.viewManager.renderView(SimulateView);
    },

    showWaitToFinish: function() {
      this.viewManager.renderView(WaitToFinishView);
    },

    showWaitToStart: function() {
      this.viewManager.renderView(WaitToStartView);
    },

    showWasLocked: function() {
      this.viewManager.renderView(WasLockedView);
    },

  });

  return AppRouter;

});
