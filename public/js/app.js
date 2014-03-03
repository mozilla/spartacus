define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'router',
  'nunjucks-env',
], function($, _, Backbone, log, Router) {

  'use strict';

  var console = log('app');
  console.log('Spinning up SPARTACUS!');


  // TODO: Show a splash screen here.


  var initialize = function(){
    // Spin up the routing.
    console.log('Initializing Routing');
    Router.initialize();
  };

  return {
    initialize: initialize,
  };

});
