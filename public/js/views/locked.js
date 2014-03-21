define([
  'cancel',
  'jquery',
  'log',
  'views/base-error',
  'views/throbber'
], function(cancel, $, log, BaseErrorView, throbber){

  'use strict';

  var console = log('view', 'locked');

  var LockedView = BaseErrorView.extend({
    el: '#app',

    events: {
      'click .button.cta': cancel.callPayFailure
    },

    render: function(){
      console.log('Rendering view');
      throbber.hide();
      // Call the super class render method.
      BaseErrorView.prototype.render.call(this, {
        'pageclass': 'full-error locked',
        'heading': this.gettext('Error'),
        'msg': this.gettext('You entered the wrong pin too many times. Your account is locked. Please try your purchase again in 5 minutes.')
      }, 'locked.html');
      return this;
    }

  });
  // Our module now returns our view
  return LockedView;
});
