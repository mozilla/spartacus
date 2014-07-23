require(['/js/require-config.js'], function() {
  require(['jquery', 'pin-widget'], function($, pin) {

    if ($('.pin-container').length) {
      pin.init();
    }

  });
});
