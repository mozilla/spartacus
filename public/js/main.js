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

    var app = window.app = new AppView();
    app.start();
  });

});
