// Based on https://github.com/mozilla/commonplace/blob/master/src/media/js/log.js
// TODO: Make a bower component.
define(['underscore'], function(_) {

  'use strict';

  var logger = function(type, tag) {

    // Give nice log prefixes:
    // > [log] This is a nice message!
    var prefix = '[' + type + ']';

    // If we have a tag, add that on:
    // > [log][special] Special messages!
    if (tag) {
      prefix += '[' + tag + ']';
    }

    return {
      log: _.bind(console.log, console, prefix),
      warn: _.bind(console.warn, console, prefix),
      error: _.bind(console.error, console, prefix),
      dir: _.bind(console.dir, console),

      // Have log('payments') but want log('payments', 'mock')?
      // log('payments').tagged('mock') gives you the latter.
      tagged: function(newTag) {
        return logger(type, tag + '][' + newTag);
      }
    };

  };

  return logger;
});
