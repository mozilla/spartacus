define([
  'cancel',
  'log',
  'utils',
  'views/base'
], function(cancel, log, utils, BaseView){

  'use strict';

  var console = log('view', 'was-locked');
  var WasLockedView = BaseView.extend({

    events: {
      'click .reset-start': 'handleResetStart',
      'click .cta': 'handleContinue'
    },

    handleContinue: function(e) {
      e.preventDefault();
      // Expectation is the user has a pin to go to enter pin.
      if (app.pin.get('pin') === true) {
        app.router.navigate('enter-pin', {trigger: true});
      } else {
        utils.trackEvent({action: 'was-locked',
                          label: 'Unexpected state'});
        app.error.render({'context': {'errorCode': 'UNEXPECTED_STATE'},
                          showCancel: false,
                          events: {'click .button.cta': cancel.callPayFailure}});
      }
    },

    handleResetStart: function(e) {
      e.preventDefault();
      app.router.navigate('reset-start', {trigger: true});
    },

    render: function(){
      app.throbber.clear();
      console.log('rendering view');
      this.setTitle(this.gettext('Was Locked'));
      this.renderTemplate('was-locked.html');
      return this;
    }
  });
  // Our module now returns our view
  return WasLockedView;
});
