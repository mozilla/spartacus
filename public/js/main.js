require(['require-config'], function() {

  // Main Entry point of the app.
  require([
    'jquery',
    'settings',
    'views/app'
  ], function($, settings, AppView){

    'use strict';

    // Common ajax settings.
    $.ajaxSetup({
      headers: {
        "X-CSRFToken": $('meta[name=csrf]').attr('content'),
        timeout: settings.ajax_timeout
      }
    });

    console.log('I AM SPARTACUS!');
    window.app = window.app || {};
    app.AppView = new AppView();

  });

});
