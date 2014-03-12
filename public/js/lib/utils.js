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
    trackWebpayClick: function() {
      console.log('trackWebpayClick');
      // TODO: Add real functionality here.
    },
    trackWebpayEvent: function() {
      console.log('trackWebpayEvent');
      // TODO: Add real functionality here.
    },
  };
});


