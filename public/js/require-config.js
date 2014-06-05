(function(){

  'use strict';

  var config = {
    baseUrl: '/js',
    paths : {
      'auth': 'lib/auth',
      'backbone': '../lib/js/backbone/backbone',
      'cancel': 'lib/cancel',
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

  if (typeof module !== 'undefined') {
    module.exports = config;
  } else if (typeof require.config !== 'undefined') {
    require.config(config);
  }

})();
