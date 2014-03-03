// Main Entry point of the app.

require.config({
  paths : {
    'backbone': '/lib/js/backbone/backbone',
    'gobbledygook': '/lib/js/gobbledygook/gobbledygook',
    'i18n-abide-utils': '/lib/js/i18n-abide-utils/i18n-abide-utils',
    'jquery': '/lib/js/jquery/jquery',
    'nunjucks': '/lib/js/nunjucks/nunjucks-slim',
    'query-string': '/lib/js/query-string/query-string',
    'require': '/lib/js/requirejs/require',
    'settings': '/js/settings/settings',
    'underscore': '/lib/js/underscore/underscore',
  },
  shim : {
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore'],
      exports: 'Backbone'
    },
  }
});


require(['app', 'lib/i18n'], function(App, i18n){
  // Setup the locale and then run init.
  i18n.initLocale(function() { App.initialize(); });
});
