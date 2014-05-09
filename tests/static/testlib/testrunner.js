require(['/js/config.js'], function(config) {

  // Setup the requires.
  require.config(config);

  require([
    'require',
    'main',
  ], function(require){

    mocha.setup('tdd');

    require([
      '/unit/test-base-view.js',
      '/unit/test-utils.js',
      '/unit/test-errors.js',
    ], function() {
      if (window.mochaPhantomJS) {
        window.mochaPhantomJS.run();
      } else {
        window.mocha.run();
      }
    });
  });
});
