define([
  'backbone',
  'underscore',
  'views/create-pin',
  'views/enter-pin',
  'views/force-auth',
  'views/init',
  'views/locked',
  'views/login',
  'views/reset-pin',
  'views/reset-start',
  'views/wait-to-finish',
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
  ResetPinView,
  ResetStartView,
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
      'spa/locked': 'showLocked',
      'spa/was-locked': 'showWasLocked',
      'spa/wait-to-start': 'showWaitToStart',
    },

    // This mapping provides a key for data attrs.
    // only routes listed here are available to be
    // mapped to from data attrs.
    mapping: {
      'wait-to-finish': 'showWaitToFinish',
    },

    getMappedRouteFunc: function(key) {
      var mapping = this.mapping;
      if (mapping[key]) {
        // Bind 'this' to the router.
        return _.bind(this[mapping[key]], this);
      } else {
        console.error('No mapped route for key: ' + key);
        return function() {
          app.error.render({errorCode: 'NO_MAPPED_ROUTE'});
        };
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
      this.viewManager.renderView(LoginView);
    },

    showResetPin: function() {
      this.viewManager.renderView(ResetPinView);
    },

    showResetStart: function() {
      this.viewManager.renderView(ResetStartView);
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
