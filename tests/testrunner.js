
require.config({
  baseUrl: 'js',
  paths : {
    'underscore': '../lib/js/underscore/underscore',
    'backbone': '../lib/js/backbone/backbone',
    'jquery': '../lib/js/jquery/jquery',
    'nunjucks': '../lib/js/nunjucks/nunjucks-slim',
    'require': '../lib/js/requirejs/require',
    'gettext': '../lib/js/gettext/gettext',
    'chai': '../lib/js/chai/chai',
    'mocha': '../lib/js/mocha/mocha',
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
