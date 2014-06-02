define([
  'i18n-abide-utils',
  'jquery',
  'log',
  'settings',
  'utils',
  'query-string'
], function(i18nUtils, $, log, settings, utils) {

  'use strict';

  var $html = utils.$html;
  var DEBUG_LANG = settings.DEBUG_LANG;
  var DEBUG_LOCALE = settings.DEBUG_LOCALE;
  var BIDI_RTL_LANGS = settings.BIDI_RTL_LANGS;
  var noopLocales = ['en_US', DEBUG_LOCALE];

  var console = log('i18n');

  function getLangFromLangAttr() {
    var lang = $html.attr('lang') || 'en-US';
    if (settings.supportedLanguages.indexOf(lang) > -1)  {
      return lang;
    } else {
      console.log('Unsupported lang: ' + lang);
      return 'en-US';
    }
  }

  function getLocaleFromLangAttr() {
    var lang = $html.attr('lang') || 'en-US';
    if (settings.supportedLanguages.indexOf(lang) > -1)  {
      return i18nUtils.localeFromLang(lang);
    } else {
      console.log('Unsupported lang: ' + lang);
      return 'en_US';
    }
  }

  return {
    gettext: i18nUtils.gettext,
    getLangFromLangAttr: getLangFromLangAttr,
    getLocaleFromLangAttr: getLocaleFromLangAttr,

    initLocale: function initLocale(cb) {

      var locale = null;
      var qs = window.queryString.parse(location.search);

      if (qs && qs.lang) {
        var lang = qs.lang;
        if (settings.supportedLanguages.indexOf(lang) > -1)  {
          locale = i18nUtils.localeFromLang(lang);
          var dir = BIDI_RTL_LANGS.indexOf(lang) > -1 ? 'rtl' : 'ltr';
          console.log('Direction: ' + dir);
          $html.attr('dir', dir);
        } else {
          console.log('Unsupported lang: ' + lang);
        }
      }

      if (!locale) {
        locale = getLocaleFromLangAttr();
      }

      console.log('Setting locale to: ' + locale);
      if (locale && noopLocales.indexOf(locale) === -1) {
        console.log('Requiring locale for locale: ' + locale);
        require([i18nUtils.format('../i18n/%s/messages', [locale])], cb);
      } else {
        if (locale === DEBUG_LOCALE){
          // Fake the i18nAbide object for on the fly debug trans.
          window._i18nAbide = {
            messages: {},
            lang: DEBUG_LANG,
            locale: DEBUG_LOCALE
          };
        }
        cb();
      }
    }
  };

});
