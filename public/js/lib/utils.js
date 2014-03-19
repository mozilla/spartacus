define(['jquery'], function($) {

  var $body = $('body');

  return {
    $body: $body,
    $doc: $(document),
    bodyData: $body.data(),
    encodeURIComponent: function encodeURIComponent(uri) {
      return window.encodeURIComponent(uri).replace(/%20/g, '+');
    },
    decodeURIComponent: function decodeURIComponent(uri) {
      return window.decodeURIComponent(uri.replace(/\+/g, ' '));
    },
    trackClick: function() {
      console.log('trackClick');
      // TODO: Add real functionality here.
    },
    trackEvent: function() {
      console.log('trackEvent');
      // TODO: Add real functionality here.
    },
  };
});


