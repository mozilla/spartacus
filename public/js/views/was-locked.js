define([
  'cancel',
  'log',
  'utils',
  'views/page'
], function(cancel, log, utils, PageView){

  'use strict';

  var console = log('view', 'was-locked');
  var WasLockedView = PageView.extend({

    events: {
      'click .reset-start': 'handleResetStart',
      'click .cta': 'handleContinue'
    },

    handleContinue: function(e) {
      e.preventDefault();
      // Expectation is the user has a pin to go to enter pin.
      if (app.pin.get('pin') === true) {
        app.router.showEnterPin();
      } else {
        utils.trackEvent({action: 'was-locked',
                          label: 'Unexpected state'});
        return app.error.render({'errorCode': 'UNEXPECTED_STATE'});
      }
    },

    handleResetStart: function(e) {
      e.preventDefault();
      app.router.showResetStart();
    },

    render: function(){
      app.throbber.close();
      console.log('rendering view');
      this.setTitle(this.gettext('Was Locked'));
      this.renderTemplate('was-locked.html');
      return this;
    }
  });

  return WasLockedView;
});
