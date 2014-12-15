define([
  'i18n',
  'jquery',
  'settings',
  'tracking',
  'underscore',
  'log'
], function(i18n, $, settings, tracking, _, log) {

  'use strict';

  var logger = log('utils');
  var uaTrackingCategory = settings.ua_tracking_category;
  var $body = $('body');

  var utils = {
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
    getOrigin: function getOrigin(locObject) {
      var loc = locObject || window.location;
      return loc.origin || loc.protocol + '//' + loc.host;
    },
    mozPaymentProvider: window.mozPaymentProvider || {
      paymentSuccess: window.paymentSuccess || function() {
        if (settings.enableWebPayments === true && window.opener) {
          window.opener.postMessage({status: 'ok'},
                                    utils.getOrigin(window.opener.location));
        } else {
          logger.error('No paymentSuccess function');
          return app.error.render({errorCode: 'NO_PAY_SUCCESS_FUNC'});
        }
      },
      paymentFailed: window.paymentFailed || function(errorCode) {
        if (settings.enableWebPayments === true && window.opener) {
          window.opener.postMessage({status: 'failed', errorCode: errorCode},
                                    utils.getOrigin(window.opener.location));
        } else {
          logger.error('No paymentFailed function');
          return app.error.render({errorCode: 'NO_PAY_FAILED_FUNC'});
        }
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
    errorCodeFromXhr: function(jqXHR, fallbackErrorCode) {
      var errorCode = fallbackErrorCode || 'UNEXPECTED_ERROR';
      if (jqXHR.responseJSON && jqXHR.responseJSON.error_code) {
        errorCode = jqXHR.responseJSON.error_code;
      } else {
        logger.log('could not find error_code in response:', jqXHR.responseText);
      }
      return errorCode;
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
        var testUrl = a.protocol + '//' + a.hostname;
        var isValid = validRedirSites.indexOf(testUrl) > -1;
        if (!isValid) {
          logger.log('URL', testUrl, 'not in redirect whitelist', validRedirSites);
        }
        return isValid;
      }
      return false;
    },
    supportsNativeFxA: function(nav) {
      // Until Native FxA is ready, let's not check this.
      if (!settings.enableNativeFxA) {
        return false;
      } else {
        // Check user-agent string to find out if we're on a FxOS device with
        // native FxA support.
        nav = nav || navigator;
        var uaMatch = nav.userAgent.match(/rv:(\d{2})/);
        var hasNativeFxA = this.bodyData.fxaAuthUrl && nav.mozId && uaMatch && uaMatch[1] >= 34;
        return hasNativeFxA;
      }
    },
    useOAuthFxA: function() {
      return this.bodyData.fxaAuthUrl && !this.supportsNativeFxA();
    },
    getL10nLinkBase: function() {
      var docLangs = ['cs', 'de', 'el', 'en-US', 'es', 'hr', 'hu', 'it', 'pl', 'pt-BR', 'sr', 'zh-CN'];
      var lang = i18n.getLangFromLangAttr();
      var docLang = docLangs.indexOf(lang) >= 0 ? lang : 'en-US';
      return this.bodyData.staticDocsUrl + 'media/docs/{type}/' + docLang + '.html?20131014-4';
    },
    getTermsLink: function() {
      var baseLink = this.getL10nLinkBase();
      return this.format(baseLink, {type: 'terms'});
    },
    getPrivacyLink: function() {
      var baseLink = this.getL10nLinkBase();
      return this.format(baseLink, {type: 'privacy'});
    },
    fxaLogin: function() {
      logger.log("FxA login - redirecting to " + this.bodyData.fxaAuthUrl);
      app.transaction.saveJWT();
      window.location.href = this.bodyData.fxaAuthUrl;
    }
  };

  return utils;
});
