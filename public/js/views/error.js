// A specialised subView for creating an error page overlay
// That sits in it's own container.
define([
  'cancel',
  'log',
  'views/base'
], function(cancel, log, BaseView){

  'use strict';

  var console = log('view', 'error');

  var ErrorView = BaseView.extend({

    el: '#error',

    events: {
      'click .button.cancel': 'defaultCancel',
    },

    defaultCancel: function(e) {
      e.preventDefault();
      this.clear();
      cancel.callPayFailure();
    },

    render: function(options){
      options = options || {};
      this.$el.empty();
      this.delegateEvents(this.events);

      if (window.app && app.throbber) {
        app.throbber.hide();
      }
      var context = options.context || {};
      var template = options.template || 'error.html';

      // Default to showing the cancel button.
      context.showCancel = options.showCancel === false ? false : true;
      // Default to showing the call to action button.
      context.showCta = options.showCta === false ? false : true;

      // Add default heading + msg.
      context.heading = context.heading || this.gettext('Error');
      context.msg = context.msg || this.gettext('Something went wrong.');
      console.log(JSON.stringify(context));

      this.setTitle(context.heading);

      // If events are passed as an option this removes and re-attaches
      // the specified events.
      if (options.events) {
        this.delegateEvents(options.events);
      }

      // Make it so!
      console.log('Rendering Error template');
      this.renderTemplate(template, context);
      return this;
    },

    hide: function() {
      console.log('Hiding Error');
      this.clear();
    }

  });

  return ErrorView;
});
