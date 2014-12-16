// Settings that can be consumed by client and server.
var settings = {
  validProviders: ['reference', 'boku', 'bango'],
  // UA tracking id.
  ua_tracking_id: 'UA-36116321-6',
  // Allow tracking of events
  ua_action_tracking_enabled: true,
  // The category used in all event tracking.
  ua_tracking_category: 'Consumer Payment Flow',
  // Turn UA tracking on/off wholesale.
  ua_tracking_enabled: false,
  // General Ajax timeout (Default 45s).
  ajax_timeout: 45000,
  // Timeout for logins (Default 90s).
  login_timeout: 90000,
  // Timeout for logout (Default 45s).
  logout_timeout: 45000,
  // Timeout for finishing transaction.
  wait_timeout: 35000,
  // Poll interval for wait-to-start/finish.
  poll_interval: 1000,
  // i18n settings.
  supportedLanguages: [
    'af',
    'ar',
    'as',
    'ast',
    'be',
    'bg',
    'bn-BD',
    'bn-IN',
    'bs',
    'ca',
    'cs',
    'cy',
    'da',
    'db-LB', // Debug locale for i18n
    'de',
    'el',
    'en-US',
    'eo',
    'es',
    'et',
    'eu',
    'fa',
    'ff',
    'fi',
    'fr',
    'fy-NL',
    'ga-IE',
    'gd',
    'gl',
    'gu',
    'he',
    'hi-IN',
    'hr',
    'ht',
    'hu',
    'id',
    'it',
    'ja',
    'km',
    'kn',
    'ko',
    'ku',
    'lij',
    'lt',
    'mk',
    'ml',
    'mn',
    'ms',
    'my',
    'nb-NO',
    'ne-NP',
    'nl',
    'or',
    'pa',
    'pl',
    'pt-BR',
    'pt-PT',
    'ro',
    'ru',
    'si',
    'sk',
    'sl',
    'sq',
    'sr',
    'sr-Latn',
    'sv-SE',
    'ta',
    'te',
    'th',
    'tr',
    'uk',
    'ur',
    'vi',
    'zh-CN',
    'zh-TW'
  ],
  DEBUG_LOCALE: 'db_LB',
  DEBUG_LANG: 'db-LB',
  BIDI_RTL_LANGS: ['ar', 'db-LB', 'fa', 'he'],
  // NOTE: these values are typically overidden by Webpay's SPA_SETTINGS.
  validRedirSites: [
    'http://mozilla.bango.net',
    'https://mozilla.bango.net',
    'https://buy.boku.com',
    'https://zippy-dev.allizom.org',
    'https://zippy.paas.allizom.org'
  ],
  enableNativeFxA: false,
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = settings;
} else if (typeof define === 'function' && define.amd) {
  define(['jquery', 'underscore'], function($, _) {

    'use strict';

    var overrides = $('body').data('settings') || {};
    return _.extend(settings, overrides);
  });
}
