require(['require-config'], function() {

  // Main Entry point of the app.
  require([
    'jquery',
    'views/app'
  ], function($, AppView){

    'use strict';

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
