define([
  'jquery',
  'underscore',
  'backbone',
  'gettext',
  'log',
  'router',
  'nunjucks-env',
], function($, _, Backbone, gettext, log, Router) {

  'use strict';

  var console = log('app');
  console.log('Spinning up SPARTACUS!');

  // Check User State here and send to the appropriate view.
  //var checkUserState = function checkState(state){
  //  var loggedIn = state.loggedIn || true;
  //  var hasPin = state.hasPin || false;
  //  var isLocked = state.isLocked || false;
  //  var wasLocked = state.wasLocked || false;

  //  if (!loggedIn) {
  //    this.transitionTo('login');
  //  } else if (isLocked) {
  //    this.transitionTo('locked');
  //  } else if (wasLocked) {
  //    this.transitionTo('was-locked');
  //  } else if (hasPin) {
  //    this.transitionTo('enter');
  //  } else if (!hasPin) {
  //    this.transitionTo('create');
  //  }
  //};

  var initialize = function(){
    // Spin up the routing.
    console.log('Initializing Routing');
    Router.initialize();
  };

  return {
    initialize: initialize,
  };

});
