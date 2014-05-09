// Configure requires.
require(['config'], function(config) {

  'use strict';

  // Setup the requires.
  require.config(config);

  // Main Entry point of the app.
  require([
    'jquery',
    'views/app'
  ], function($, AppView){

    // Common ajax settings.
    $.ajaxSetup({
      headers: {
        "X-CSRFToken": $('meta[name=csrf]').attr('content')
      }
    });

    console.log('I AM SPARTACUS!');
    window.app = window.app || {};
    app.AppView = new AppView();

  });
});
