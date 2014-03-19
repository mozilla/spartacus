define([], function(){

  var staticUrl = document.body.getAttribute('data-static-url');

  staticUrl = staticUrl ? staticUrl + '/js' : '/js';

  // Note: all paths here should be relative. Anything that starts with a
  // slash will end up being resolved relative to the document which is probably not
  // what you want.

  return {
    baseUrl: staticUrl,
    paths : {
      'backbone': '../lib/js/backbone/backbone',
      'gobbledygook': '../lib/js/gobbledygook/gobbledygook',
      'i18n-abide-utils': '../lib/js/i18n-abide-utils/i18n-abide-utils',
      'i18n': 'lib/i18n',
      'id': 'lib/id',
      'jquery': '../lib/js/jquery/jquery',
      'log': 'lib/log',
      'nunjucks-slim': '../lib/js/nunjucks/nunjucks-slim',
      'nunjucks': 'nunjucks-env',
      'query-string': '../lib/js/query-string/query-string',
      'require': '../lib/js/requirejs/require',
      'settings': 'settings/settings',
      'underscore': '../lib/js/underscore/underscore',
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
      }
    }
  };
});

