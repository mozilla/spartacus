require(['require-config'], function() {

  // Main Entry point of the app.
  require([
    'fastclick',
    'jquery',
    'settings',
    'views/app'
  ], function(fastclick, $, settings, AppView){

    'use strict';

    // Common ajax settings.
    $.ajaxSetup({
      headers: {
        "X-CSRFToken": $('meta[name=csrf]').attr('content'),
        timeout: settings.ajax_timeout
      }
    });

    fastclick.attach(document.body);

    window.app = new AppView();
    window.app.start();
  });

});
