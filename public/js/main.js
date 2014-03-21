// Configure requires.
require(['config'], function(config) {

  // Setup the requires.
  require.config(config);

  // Main Entry point of the app.
  require([
    'backbone',
    'i18n',
    'id',
    'jquery',
    'log',
    'models/user',
    'router',
    'utils',
    'views/throbber',
  ], function(Backbone, i18n, id, $, log, UserModel, router, utils, throbber){

    window.app = {};
    var console = log('app');

    // Common ajax settings.
    $.ajaxSetup({
      headers: {
        "X-CSRFToken": $('meta[name=csrf]').attr('content')
      }
    });

    function initialize() {
      console.log('I AM SPARTACUS!');
      // Always show throbber.
      throbber.show();
      // Spin up the routing.
      console.log('Initializing Routing');
      app.user = new UserModel();
      app.router = new router.AppRouter();
      Backbone.history.start({pushState: true, root: app.router.root});
      // Start identity watch.
      app.user.watchIdentity();
    }

    // Require locale then run init.
    i18n.initLocale(initialize);
  });
});
