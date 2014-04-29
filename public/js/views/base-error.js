// A specialised subView for creating an error page overlay
// That sits in it's own container.
define([
  'cancel',
  'log',
  'views/base',
  'views/throbber'
], function(cancel, log, BaseView, throbber){

  'use strict';

  var console = log('view', 'base-error');

  var BaseErrorView = BaseView.extend({
    el: '#error',

    events: {
      // Cancel always kills payment flow.
      'click .button.cancel': function() {
        // Remove error.
        this.clear();
        // Cancel payment (shows throbber);
        cancel.callPayFailure();
      }
    },

    render: function(context, template){
      throbber.hide();
      context = context || {};
      template = template || 'error.html';
      console.log('rendering error');
      context.heading = context.heading || this.gettext('Error');
      context.msg = context.msg || this.gettext('Something went wrong.');
      this.setTitle(context.heading);
      this.renderTemplate(template, context || {});
      return this;
    }

  });

  return BaseErrorView;
});
