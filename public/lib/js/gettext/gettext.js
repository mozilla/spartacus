/*globals json_locale_data: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(['underscore'], function(_) {
  'use strict';

  function Gettext() {
    return {
      gettext: function (msgid) {
        // Hack for now until we get i18n-abide setup.
        return msgid;
        /*jshint camelcase: false */
        if (json_locale_data && json_locale_data.client) {
          var dict = json_locale_data.client;
          if (dict[msgid] && dict[msgid].length >= 2 && dict[msgid][1].trim() !== "") {
            return dict[msgid][1];
          }
        }
        return msgid;
      },
      // See lib/i18n.js format docs
      format: function (fmt, obj, named) {
        if (! fmt) return "";
        if (! fmt.replace) {
          return fmt;
        }
        if (named) {
          return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)]);});
        } else {
          return fmt.replace(/%s/g, function(){return String(obj.shift());});
        }
      }
    };
  }

  var gt = new Gettext();
  return {
    // Using _.bind as ES5 bind isn't in phantomjs webkit.
    // See https://github.com/ariya/phantomjs/issues/10522
    gettext: _.bind(gt.gettext, gt),
    format: _.bind(gt.format, gt)
  };
});
