define([
  'jquery',
  'lib/pin-widget',
  'log',
  'utils',
  'views/create-pin'
], function($, pin, log, utils, CreatePinView){

  'use strict';

  // Reset is basically the same as create pin except
  // where the data goes is different and so are the titles.
  var ResetPinView = CreatePinView.extend({

    submitData: function(pinData) {
      var pinResetAction = 'reset-pin';
      var req = app.pin.sync('update', app.pin, {'data': {'pin': pinData}});

      req.done(function() {
        app.router.navigate('wait-for-tx', {trigger: true});
      }).fail(function($xhr, textStatus) {
        if (textStatus === 'timeout') {
          console.log('Request timed out');
          utils.trackEvent({'action': pinResetAction,
                            'label': 'Pin Reset API Call Timed Out'});
          app.error.render({
            context: {
              buttonText: this.gettext('Retry?'),
              errorCode: 'RESET_PIN_REQ_TIMEOUT'
            },
            events: {
              'click .button.cta': function(){ $.ajax(this); }
            }
          });

        } else if ($xhr.status === 400) {
          console.log('Pin data invalid');
          utils.trackEvent({'action': pinResetAction,
                            'label': 'Pin Reset API Call Invalid Form Data'});
          app.error.render({context: {errorCode: 'PIN_RESET_INVALID'}});
        } else if ($xhr.status === 403) {
          console.log('User not authenticated');
          utils.trackEvent({'action': pinResetAction,
                            'label': 'Pin Reset API Call Permission Denied'});
          app.error.render({context: {errorCode: 'PIN_RESET_PERM_DENIED'}});
        } else if ($xhr.status === 404) {
          console.log("User doesn't exist");
          utils.trackEvent({'action': pinResetAction,
                            'label': "Pin Reset API Call User Doesn't exist"});
          app.error.render({context: {errorCode: 'PIN_RESET_USER_DOES_NOT_EXIST'}});
        } else {
          console.log("Unhandled error");
          utils.trackEvent({'action': pinResetAction,
                            'label': "Pin Reset API Call Unhandled error"});
          app.error.render({context: {errorCode: 'PIN_RESET_UNHANDLED_ERROR'}});
        }

        return req;
      });
    },

    render: function(){
      var context = {
        buttonText: this.gettext('Continue'),
        pinTitle: this.gettext('Reset Pin')
      };
      this.renderTemplate('pin-form.html', context);
      this.setTitle(this.gettext('Reset Pin'));
      pin.init();
      app.throbber.hide();
      return this;
    }

  });

  // Our module now returns our view
  return ResetPinView;
});
