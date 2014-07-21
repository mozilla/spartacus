// A specialised subView for creating an error page overlay
// That sits in it's own container.
define([
  'cancel',
  'error-codes',
  'log',
  'views/base'
], function(cancel, errorCodes, log, BaseView){

  'use strict';

  var console = log('view', 'error');

  var ErrorView = BaseView.extend({

    el: '#error',

    events: {
      'click .button.cancel': 'defaultCancel',
    },

    defaultCancel: function(e) {
      e.preventDefault();
      this.close();
      cancel.callPayFailure();
    },

    render: function(options){
      options = options || {};

      this.close();
      this.$el.empty();
      this.delegateEvents(this.events);

      if (window.app && app.throbber) {
        app.throbber.close();
      }

      var errorCode = options.errorCode;
      var msg = options.msg;
      var template = options.template || 'error.html';

      if (!msg && errorCode) {
        msg = errorCodes[errorCode];
      }

      var context = {
        // The cancel modifier.
        cancelModifier: 'cancel',
        // The cancelText for the cancel button.
        cancelText: options.cancelText || this.gettext('Cancel'),
        // The call to action button text.
        ctaText: options.ctaText || this.gettext('OK'),
        // The error code to display.
        errorCode: errorCode,
        // Add default heading + msg.
        heading: options.heading || this.gettext('Error'),
        // Use passed-in msg / or errorCode message / or default.
        msg: msg || this.gettext('An unexpected error occurred.'),
        // The page class for the error message.
        pageclass: options.pageclass,
        // Default to showing the cancel button.
        showCancel: options.showCancel === false ? false : true,
        // Default to showing not the call to action button.
        showCta: options.showCta || false,
      };

      console.log(JSON.stringify(context));

      this.setTitle(context.heading);

      // If events are passed as an option this removes and re-attaches
      // the specified events.
      if (options.ctaCallback || options.cancelCallback) {
        var customEvents = {};
        if (options.cancelCallback) {
          customEvents['click .button.cancel'] = options.cancelCallback;
          context.showCancel = true;
        } else if (context.showCancel) {
          customEvents['click .button.cancel'] = this.defaultCancel;
        }
        if (options.ctaCallback) {
          customEvents['click .button.cta'] = options.ctaCallback;
          context.showCta = true;
        }
        this.delegateEvents(customEvents);
      }

      if (!options.cancelCallback && context.showCancel === true &&
          context.showCta === false) {
        if (!options.cancelText) {
          context.cancelText = this.gettext('OK');
        }
        context.cancelModifier = 'cancel cta';
      }

      // Make it so!
      console.log('Rendering Error template');
      this.renderTemplate(template, context);
    }

  });

  return ErrorView;
});
