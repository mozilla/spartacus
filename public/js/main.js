// Main Entry point of the app.

require.config({
  paths : {
    'underscore': '/lib/js/underscore/underscore',
    'backbone': '/lib/js/backbone/backbone',
    'jquery': '/lib/js/jquery/jquery',
    'nunjucks': '/lib/js/nunjucks/nunjucks-slim',
    'require': '/lib/js/requirejs/require',
    'gettext': '/lib/js/gettext/gettext',
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


require(['app'], function(App){
  App.initialize();
});
