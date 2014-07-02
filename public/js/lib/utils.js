define([
  'jquery',
  'settings',
  'underscore'
], function($, settings, _) {

  'use strict';

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
        app.error.render({
          context: {
            errorCode: 'NO_PAY_SUCCESS_FUNC',
          },
        });
      },
      paymentFailed: window.paymentFailed || function() {
        console.error('No paymentFailed function');
        app.error.render({
          context: {
            errorCode: 'NO_PAY_FAILED_FUNC',
          },
        });
      },
    },
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
    checkURL: function(url, options) {
      options = options || {};
      var validSchemes = options.validSchemes || settings.validSchemes;
      var validHosts = options.validHosts || settings.validHosts;
      if (url && _.isArray(validSchemes) && _.isArray(validHosts)) {
        // Always allow urls that match window.location.hostname.
        validHosts.push(window.location.hostname);
        var a = document.createElement('a');
        a.href = url;
        var scheme = a.protocol.replace(':','');
        var hostname = a.hostname;
        return validSchemes.indexOf(scheme) > -1 && validHosts.indexOf(hostname) > -1;
      }
      return false;
    }
  };
});


