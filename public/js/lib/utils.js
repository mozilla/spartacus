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

  var fxPayCompletionTimer;
  var fxPayCompletionTimeoutMs = 10000;

  function fxPayCompletionError(errorCode) {
    return app.error.render({
      errorCode: errorCode,
      cancelCallback: function() {
        window.close();
      }
    });
  }

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
    onBrokenWebRT: function() {
      // This is a workaround for bug 1133963.
      // The crux of the bug is that mozPaymentProvider has not
      // been ported to WebIDL on webRT.
      return (window.mozPaymentProvider &&
              window.navigator.userAgent.indexOf('Mobile') === -1);
    },
    // Note that mozPaymentProvider gets overidden below when
    // onBrokenWebRT() is true.
    mozPaymentProvider: window.navigator.mozPaymentProvider ||
                        // Prior to bug 1097928 this was on window:
                        window.mozPaymentProvider || {
      paymentSuccess: window.paymentSuccess || function() {
        logger.log('web based mozPaymentProvider: paymentSuccess');
        if (!window.opener) {
          logger.error('paymentSuccess called but no window.opener was found');
          return fxPayCompletionError('INCOMPLETE_PAY_SUCCESS');
        }
        if (fxPayCompletionTimer) {
          window.clearTimeout(fxPayCompletionTimer);
        }
        fxPayCompletionTimer = window.setTimeout(function() {
          return fxPayCompletionError('PAY_SUCCESS_TIMEOUT');
        }, fxPayCompletionTimeoutMs);
        // Note: Do not add sensitive data to this
        // as it's sent to unspecified origins.
        window.opener.postMessage({status: 'ok'}, '*');
      },
      paymentFailed: window.paymentFailed || function(errorCode) {
        logger.log('web based mozPaymentProvider: paymentFailed');
        if (!window.opener) {
          logger.error('paymentFailed called but no window.opener was found');
          return fxPayCompletionError('INCOMPLETE_PAY_FAIL');
        }
        if (fxPayCompletionTimer) {
          window.clearTimeout(fxPayCompletionTimer);
        }
        fxPayCompletionTimer = window.setTimeout(function() {
          return fxPayCompletionError('PAY_FAILURE_TIMEOUT');
        }, fxPayCompletionTimeoutMs);
        // Note: Do not add sensitive data to this
        // as it's sent to unspecified origins.
        window.opener.postMessage({status: 'failed', errorCode: errorCode}, '*');
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
    hasMozId: function(nav) {
      nav = nav || navigator;
      var mozId;
      try {
        mozId = nav.mozId;
      } catch(e) {
        // Handle exception due to bug 1129650
        logger.error(e);
      }
      return typeof mozId !== 'undefined';
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
        var hasNativeFxA = this.bodyData.fxaAuthUrl && utils.hasMozId(nav) && uaMatch && uaMatch[1] >= 34;
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

  if (utils.onBrokenWebRT()) {
    // This is a workaround for bug 1133963.
    logger.warn('overiding mozPaymentProvider on webRT; user agent:',
                window.navigator.userAgent);

    utils.mozPaymentProvider = {
      paymentSuccess: function() {
        logger.log('webRT override: handling paymentSuccess()');
        app.error.render({
          heading: i18n.gettext('Success'),
          msg: i18n.gettext(
            'Your purchase is complete. Close the window to continue'),
          showCancel: false,
          showCta: false,
        });
      },
      paymentFailed: function(errorCode) {
        logger.log(
          'webRT override: handling paymentFailed(); code:', errorCode);
        app.error.render({
          errorCode: errorCode,
          msg: i18n.gettext(
                 'An error occurred. Close the window to continue'),
          showCancel: false,
          showCta: false,
        });
      },
    };
  } else {
    logger.log('not overriding mozPaymentProvider :)');
  }

  return utils;
});
