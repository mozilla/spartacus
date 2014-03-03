/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(['gobbledygook'], function() {
  'use strict';

  return {

    localeFromLang: function(language) {
      if (! language || ! language.split) {
        return "";
      }
      var parts = language.split('-');
      if (parts.length === 1) {
        return parts[0].toLowerCase();
      } else if (parts.length === 2) {
        return this.format('%s_%s', [parts[0].toLowerCase(), parts[1].toUpperCase()]);
      } else if (parts.length === 3) {
        // sr-Cyrl-RS should be sr_RS
        return this.format('%s_%s', [parts[0].toLowerCase(), parts[2].toUpperCase()]);
      } else {
        console.error(this.format("Unable to map a local from language code [%s]", [language]));
        return language;
      }
    },

    gettext: function (msgid) {
      /*jshint camelcase: false */
      var localeData = typeof window._i18nAbide !== 'undefined' ? window._i18nAbide : window.json_locale_data;

      if (localeData && localeData.messages) {
        if (localeData.lang === 'db-LB' && window.Gobbledygook) {
          return window.Gobbledygook(msgid);
        }

        var dict = localeData.messages;
        if (dict[msgid] && dict[msgid].length >= 2 && dict[msgid][1].trim() !== "") {
          return dict[msgid][1];
        }
      }
      return msgid;
    },

    format: function (fmt, obj, named) {
      if (!fmt) return "";
      if (!fmt.replace) {
        return fmt;
      }
      if (named) {
        return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)]);});
      } else {
        return fmt.replace(/%s/g, function(){return String(obj.shift());});
      }
    }
  };
});
