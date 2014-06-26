define([
  'cancel',
  'jquery',
  'log',
  'pin-widget',
  'underscore',
  'utils',
  'views/page'
], function(cancel, $, log, pin, _, utils, PageView){

  'use strict';

  var EnterPinView = PageView.extend({

    events: {
      'click .cancel': cancel.callPayFailure,
      'click .cta:enabled': 'handleSubmit',
      'click .forgot-pin a': 'handleForgotPin',
    },

    handleForgotPin: function(e) {
      e.preventDefault();
      app.router.navigate('spa/reset-start', {trigger: true});
    },

    handleSubmit: function(e) {
      if (e) {
        e.preventDefault();
      }
      var that = this;
      var req = app.pin.sync('check', app.pin, {data: {pin: pin.getPin()}});

      var pinCheckAction = 'check-pin';
      app.throbber.render();

      req.done(function() {
        app.router.navigate('spa/wait-to-start', {trigger: true});
      }).fail(function($xhr, textStatus) {

        app.throbber.close();

        var data;
        try {
          data = JSON.parse($xhr.responseText);
        } catch(e) {
          console.log('Invalid JSON');
        }
        if (data) {
          data = _.pick(data, _.keys(app.pin.defaults));
          app.pin.set(data);
          if (app.pin.changed.pin_is_locked_out === true) {
            return;
          }
        }

        if (textStatus === 'timeout') {
          console.log('Request timed out');
          utils.trackEvent({action: pinCheckAction,
                            label: 'Pin Check API Call Timed Out'});
          app.error.render({
            context: {
              ctaText: that.gettext('Retry?'),
              errorCode: 'ENTER_PIN_TIMEOUT'
            },
            ctaCallback: function(e) {
              e.preventDefault();
              that.handleSubmit();
            }
          });

        } else if ($xhr.status === 400) {
          console.log('Wrong pin');
          utils.trackEvent({action: pinCheckAction,
                            label: 'Pin Check API Call Invalid Form Data'});
          pin.resetPinUI();
          pin.showError(that.gettext('Wrong PIN'));
        } else if ($xhr.status === 403) {
          console.log('User not authenticated');
          utils.trackEvent({action: pinCheckAction,
                            label: 'Pin Check API Call Permission Denied'});
          app.error.render({context: {errorCode: 'PIN_ENTER_PERM_DENIED'}});
        } else if ($xhr.status === 404) {
          console.log("User doesn't exist");
          utils.trackEvent({action: pinCheckAction,
                            label: "Pin Check API Call User Doesn't exist"});
          app.error.render({context: {errorCode: 'PIN_ENTER_USER_DOES_NOT_EXIST'}});
        } else {
          console.log("Unhandled error");
          utils.trackEvent({action: pinCheckAction,
                            label: 'Pin Check API Call Unhandled error'});
          app.error.render({context: {errorCode: 'PIN_ENTER_UNHANDLED_ERROR'}});
        }
      });
    },

    render: function(){
      var context = {
        ctaText: this.gettext('Submit'),
        pinTitle: this.gettext('Enter PIN'),
        showForgotPin: true
      };
      this.renderTemplate('pin-form.html', context);
      this.setTitle(this.gettext('Enter PIN'));
      pin.init();
      app.throbber.close();
      return this;
    }

  });

  // Our module now returns our view
  return EnterPinView;
});
