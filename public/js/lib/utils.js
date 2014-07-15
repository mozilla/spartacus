define([
  'jquery',
  'settings',
  'tracking',
  'underscore'
], function($, settings, tracking, _) {

  'use strict';

  var uaTrackingCategory = settings.ua_tracking_category;

  var $body = $('body');

  return {
    $body: $body,
    $doc: $(document),
    $html: $('html'),
    bodyData: $body.data(),
    encodeURIComponent: function encodeURIComponent(uri) {
      return window.encodeURIComponent(uri).replace(/%20/g, '+');
    },
    decodeURIComponent: function decodeURIComponent(uri) {
      return window.decodeURIComponent(uri.replace(/\+/g, ' '));
    },
    mozPaymentProvider: window.mozPaymentProvider || {
      paymentSuccess: window.paymentSuccess || function() {
        console.error('No paymentSuccess function');
        return app.error.render({errorCode: 'NO_PAY_SUCCESS_FUNC'});
      },
      paymentFailed: window.paymentFailed || function() {
        console.error('No paymentFailed function');
        return app.error.render({errorCode: 'NO_PAY_FAILED_FUNC'});
      },
    },
    trackEvent: function(options) {
      options = options || {};
      tracking.trackEvent(uaTrackingCategory, options.action, options.label,
                          options.value);
    },
    apiUrl: function(path) {
      if (path.slice(-1) !== '/') {
        path = path + '/';
      }
      if (path[0] !== '/') {
        path = '/' + path;
      }
      return (this.bodyData.baseApiURL || '/mozpay/v1/api') + path;
    },
    format: (function() {
      var re = /\{([^}]+)\}/g;
      return function(s, args) {
        if (!s) {
          throw 'Format string is empty!';
        }
        if (!args) return;
        if (!(args instanceof Array || args instanceof Object))
          args = Array.prototype.slice.call(arguments, 1);
        return s.replace(re, function(_, match){ return args[match]; });
      };
    })(),
    isValidRedirURL: function(url, options) {
      options = options || {};
      var validRedirSites = options.validRedirSites || settings.validRedirSites;
      if (url && _.isArray(validRedirSites)) {
        var a = document.createElement('a');
        a.href = url;
        return validRedirSites.indexOf(a.protocol + '//' + a.hostname) > -1;
      }
      return false;
    }
  };
});
