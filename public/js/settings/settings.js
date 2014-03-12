// Settings that can be consumed by client and server.
var settings = {
  // General Ajax timeout (Default 45G).
  ajax_timeout: 45000,
  // Timeout for logins (Default 90s).
  login_timeout: 90000,
  // i18n settings.
  supportedLanguages: [
    'af',
    'bg',
    'ca',
    'cs',
    'da',
    'de',
    'db-LB', // Debug
    'el',
    'en-US',
    'es',
    'eu',
    'fi',
    'fr',
    'fy-NL',
    'ga-IE',
    'hr',
    'hu',
    'id',
    'it',
    'ja',
    'ko',
    'mk',
    'my',
    'nl',
    'pl',
    'pt-BR',
    'pt-PT',
    'ro',
    'ru',
    'sk',
    'sl',
    'sq',
    'sr',
    'sr-Latn',
    'srp',
    'sv-SE',
    'te',
    'th',
    'ur',
    'vi',
    'zh-CN',
    'zh-TW'
  ],
  DEBUG_LOCALE: 'db_LB',
  DEBUG_LANG: 'db-LB',
  BIDI_RTL_LANGS: ['ar', 'db-LB', 'fa', 'he'],
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = settings;
} else if (typeof define === 'function' && define.amd) {
  define([], function() {
    return settings;
  });
}
