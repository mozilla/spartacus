define({
  app_name: "Spartacus",
  shim : {
    'ember' : {
      deps: ['handlebars', 'jquery'],
      exports: 'Ember'
    }
  },
  paths : {
    'jquery': '/media/lib/js/jquery',
    'handlebars': '/media/lib/js/handlebars',
    'ember': '/media/lib/js/ember',
    'require': '/media/lib/js/require',
  },
  hbs: {
    templateExtension: "html"
  }
});


