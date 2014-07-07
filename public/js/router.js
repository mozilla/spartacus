define([
  'backbone',
  'underscore',
  'views/create-pin',
  'views/enter-pin',
  'views/force-auth',
  'views/init',
  'views/locked',
  'views/login',
  'views/payment-complete',
  'views/payment-failed',
  'views/reset-pin',
  'views/reset-start',
  'views/wait-to-start',
  'views/was-locked'
], function(
  Backbone,
  _,
  CreatePinView,
  EnterPinView,
  ForceAuthView,
  InitView,
  LockedView,
  LoginView,
  PaymentCompleteView,
  PaymentFailedView,
  ResetPinView,
  ResetStartView,
  WaitToStartView,
  WasLockedView
){

  'use strict';

  var AppRouter = Backbone.Router.extend({

    initialize: function(options){
      this.viewManager = new options.ViewManager();
      this.app = options.app;
    },

    root: '/mozpay',

    routes: {
      '': 'showInit',
      'spa/create-pin': 'showCreatePin',
      'spa/enter-pin': 'showEnterPin',
      'spa/force-auth': 'showForceAuth',
      'spa/reset-pin': 'showResetPin',
      'spa/reset-start': 'showResetStart',
      'spa/locked': 'showLocked',
      'spa/was-locked': 'showWasLocked',
      'spa/provider/:provider/complete-payment': 'showPaymentComplete',
      'spa/provider/:provider/payment-failed/:error': 'showPaymentFailed',
      'spa/wait-to-start': 'showWaitToStart',
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
      this.viewManager.renderView(LoginView);
    },

    showPaymentComplete: function(provider) {
      var options = {params: {provider: provider}};
      this.viewManager.renderView(PaymentCompleteView, options);
    },

    showPaymentFailed: function(provider, error) {
      var options = {params: {provider: provider, error: error}};
      this.viewManager.renderView(PaymentFailedView, options);
    },

    showResetPin: function() {
      this.viewManager.renderView(ResetPinView);
    },

    showResetStart: function() {
      this.viewManager.renderView(ResetStartView);
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
