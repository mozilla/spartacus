
require.config({
  baseUrl: 'js',
  paths : {
    'backbone': '../lib/js/backbone/backbone',
    'chai': '../lib/js/chai/chai',
    'gobbledygook': '../lib/js/gobbledygook/gobbledygook',
    'i18n-abide-utils': '../lib/js/i18n-abide-utils/i18n-abide-utils',
    'jquery': '../lib/js/jquery/jquery',
    'mocha': '../lib/js/mocha/mocha',
    'nunjucks': '../lib/js/nunjucks/nunjucks-slim',
    'require': '../lib/js/requirejs/require',
    'underscore': '../lib/js/underscore/underscore',
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


require([
  'require',
  'chai',
  'mocha',
  'app',
], function(require){

  mocha.setup('tdd');

  require([
    'test-base-view.js',
    'test-utils.js'
  ], function() {
    if (window.mochaPhantomJS) {
      mochaPhantomJS.run();
    } else {
      mocha.run();
    }
  });

});
