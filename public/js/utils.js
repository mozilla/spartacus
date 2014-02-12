define(['jquery'], function($) {

  var prefix = 'Webpay | ';

  return {

    updateTitle: function updateTitle(title) {
      $('title').text(prefix + title);
    },

    encodeURIComponent: function encodeURIComponent(uri) {
      return window.encodeURIComponent(uri).replace(/%20/g, '+');
    },

    decodeURIComponent: function decodeURIComponent(uri) {
      return window.decodeURIComponent(uri.replace(/\+/g, ' '));
    }
  };
});


