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
    })()

  };
});
