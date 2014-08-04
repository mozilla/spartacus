require(['require-config'], function() {

  // Main Entry point of the app.
  require([
    'fastclick',
    'jquery',
    'settings',
    'views/app'
  ], function(fastclick, $, settings, AppView){

    'use strict';

     //  For fxa auth verification, skip the usual stuff.
    if (window.location.pathname === "/mozpay/spa/fxa-auth") {
      console.log('authorizing FxA login');
      window.opener.postMessage({auth_code: window.location.toString()},
                                window.location.origin);
      window.close();
      return;
    }
    // Common ajax settings.
    $.ajaxSetup({
      headers: {
        "X-CSRFToken": $('meta[name=csrf]').attr('content')
      },
      timeout: settings.ajax_timeout
    });

    fastclick.attach(document.body);

    window.app = new AppView();
    window.app.start();
  });

});
