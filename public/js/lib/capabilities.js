define([], function() {

  'use strict';

  return {
    hasLocalStorage: (function() {
      try {
        localStorage.setItem('spa', 'spa');
        localStorage.removeItem('spa');
        return true;
      } catch(e) {
        return false;
      }
    })(),
    isFirefoxAndroid: function(ua) {
      ua = ua || navigator.userAgent;
      return ua.indexOf('Firefox') !== -1 &&
             ua.indexOf('Android') !== -1;
    }
  };
});
