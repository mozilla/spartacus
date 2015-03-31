require(['require-config'], function() {

  // Main Entry point of the app.
  require([
    'auth',
    'fastclick',
    'jquery',
    'settings',
    'views/app'
  ], function(auth, fastclick, $, settings, AppView){

    'use strict';

    // Common ajax settings.
    $.ajaxSetup({
      headers: {
        "X-CSRFToken": $('meta[name=csrf]').attr('content'),
        "Accept": "application/json"
      },
      timeout: settings.ajax_timeout
    });

    fastclick.attach(document.body);

    window.app = new AppView();
    window.app.start();
  });

});
