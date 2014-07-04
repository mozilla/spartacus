require(['/js/require-config.js'], function() {

  mocha.setup('tdd');

  require([
    '/unit/test-base-view.js',
    '/unit/test-errors.js',
    '/unit/test-locale-utils.js',
    '/unit/test-mcc-mnc.js',
    '/unit/test-persona-config.js',
    '/unit/test-provider-obj.js',
    '/unit/test-settings.js',
    '/unit/test-utils.js'
  ], function() {
    if (window.mochaPhantomJS) {
      window.mochaPhantomJS.run();
    } else {
      window.mocha.run();
    }
  });

});
