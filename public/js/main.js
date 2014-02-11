// Main Entry point of the app.

require.config({
  paths : {
    'underscore': '/lib/js/underscore/underscore',
    'backbone': '/lib/js/backbone/backbone',
    'jquery': '/lib/js/jquery/jquery',
    'nunjucks': '/lib/js/nunjucks/nunjucks',
    'require': '/lib/js/requirejs/require',
  },
  shim : {
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
