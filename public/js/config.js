define([], function(){
  return {
    baseUrl: '/js',
    paths : {
      'backbone': '/lib/js/backbone/backbone',
      'chai': '/lib/js/chai/chai',
      'gobbledygook': '/lib/js/gobbledygook/gobbledygook',
      'i18n-abide-utils': '/lib/js/i18n-abide-utils/i18n-abide-utils',
      'i18n': 'lib/i18n',
      'id': 'lib/id',
      'jquery': '/lib/js/jquery/jquery',
      'log': 'lib/log',
      'mocha': '/lib/js/mocha/mocha',
      'nunjucks-slim': '/lib/js/nunjucks/nunjucks-slim',
      'nunjucks': 'nunjucks-env',
      'query-string': '/lib/js/query-string/query-string',
      'require': '/lib/js/requirejs/require',
      'settings': '/js/settings/settings',
      'underscore': '/lib/js/underscore/underscore',
      'utils': 'lib/utils',
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
  };
});

