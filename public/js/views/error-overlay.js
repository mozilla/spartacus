/*

A specialised subView for creating an error page overlay
That sits in its own container.

Usage:

  var error = new ErrorOverlay();
  error.render({'heading': 'wassip', 'msg': 'woops', 'buttonText': 'Retry?'});

*/
define([
  'log',
  'views/base-error'
], function(log, BaseErrorView){

  'use strict';

  var console = log('view', 'error-overlay');

  var ErrorOverlay = BaseErrorView.extend({
    el: '#error',

    initialize: function(opts) {
      BaseErrorView.prototype.initialize();
      opts = opts || {};
      console.log('Init error overlay');
      var buttonFunc = opts.buttonFunc;
      if (typeof buttonFunc === 'function') {
        this.events['click #error .button.cta'] = buttonFunc;
      }
    },
  });

  return ErrorOverlay;
});
