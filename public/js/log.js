// Borrowed from https://github.com/mozilla/commonplace/blob/master/src/media/js/log.js
// TOOD: Make a bower component.
define(['utils'], function(utils) {

  if (!('groupCollapsed' in window.console)) {
    window.console.groupCollapsed = window.console.group = window.console.log;
    window.console.groupEnd = function() {};
  }

  var slice = Array.prototype.slice;
  var filter;
  var logs;
  var allLogs = [];
  var origConsole = window.console;

  var logger = function(type, tag, onlog) {

    // Give nice log prefixes:
    // > [log] This is a nice message!
    var prefix = '[' + type + ']';

    // If we have a tag, add that on:
    // > [log][special] Special messages!
    if (tag) {
      prefix += '[' + tag + ']';
    }
    prefix += ' ';

    if (!(type in logs)) {
      logs[type] = [];
    }

    var logQueue = logs[type];

    function make(logLevel) {
      return function() {
        var args = slice.call(arguments, 0);
        if (args.length) {
          args[0] = prefix + args[0];
          args = args.map(filter);
          logQueue.push(args);
          allLogs.push(args);
          if (onlog) {
            onlog(args);
          }
        }

        // TODO: Add colorification support here for browsers that support it.
        // *cough cough* not firefox *cough*

        console[logLevel].apply(console, args);
      };
    }

    return {
      log: make('log'),
      warn: make('warn'),
      error: make('error'),
      dir: function() {
        if (window.console && window.console.dir) {
          window.console.dir.apply(console, arguments);
        }
      },
      group: make('group'),
      groupCollapsed: make('groupCollapsed'),
      groupEnd: make('groupEnd'),

      // Have log('payments') but want log('payments', 'mock')?
      // log('payments').tagged('mock') gives you the latter.
      tagged: function(newTag) {
        return logger(type, tag + '][' + newTag, onlog);
      }
    };
  };

  logger.unmentionables = [];
  logger.unmention = function(term) {
    logger.unmentionables.push(term);
    logger.unmentionables.push(utils.encodeURIComponent(term));
  };

  logs = logger.logs = {};
  logger.all = allLogs;
  logger.getRecent = function(count, type) {
    var selectedLogs = type ? logs[type] : allLogs;
    var length = selectedLogs.length;
    return selectedLogs.slice(Math.max(length - count, 0), length);
  };

  filter = logger.filter = function(data) {
    if (typeof data !== 'string') {
      return data;
    }
    for (var i = 0, e; e = logger.unmentionables[i++];) {
      data = data.replace(e, '---');
    }
    return data;
  };

  logger.dir = function(data) {
  };

  return logger;
});
