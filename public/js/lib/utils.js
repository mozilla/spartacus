define(['jquery'], function($) {

  'use strict';

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
    mozPaymentProvider: window.mozPaymentProvider || {},
    trackClick: function() {
      console.log('trackClick');
      // TODO: Add real functionality here.
    },
    trackEvent: function() {
      console.log('trackEvent');
      // TODO: Add real functionality here.
    },
    apiUrl: function(path) {
      if (path.slice(-1) !== '/') {
        path = path + '/';
      }
      if (path[0] !== '/') {
        path = '/' + path;
      }
      var url = (this.bodyData.baseApiURL || '/mozpay/v1/api') + path;
      console.log(url);
      return url;
    }
  };
});


