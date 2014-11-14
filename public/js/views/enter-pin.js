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

  var enterKeyCode = 13;
  var logger = log('views', 'enter-pin');
  var pinCheckAction = 'check-pin';

  var EnterPinView = PageView.extend({

    events: {
      'click .cancel': cancel.callPayFailure,
      'click .cta:enabled': 'handleSubmit',
      'keypress': function(e) {
        if ($('.cta:enabled').length && e.keyCode === enterKeyCode) {
          this.handleSubmit(e);
        }
      },
      'click .forgot-pin a': 'handleForgotPin',
    },

    handleForgotPin: function(e) {
      e.preventDefault();
      utils.trackEvent({'action': pinCheckAction,
                        'label': 'Forgot PIN Clicked'});
      app.router.showResetStart();
    },

    handleSubmit: function(e) {
      if (e) {
        e.preventDefault();
        $(e.target).prop('disabled', true);
      }

      var that = this;
      var req = app.pin.sync('check', app.pin, {data: {pin: pin.getPin()}});

      app.throbber.render();

      req.done(function() {
        app.router.showWaitToStart();
        utils.trackEvent({action: pinCheckAction,
                          label: 'PIN Check Success'});
      }).fail(function($xhr, textStatus) {

        app.throbber.close();

        var data;
        try {
          data = JSON.parse($xhr.responseText);
        } catch(e) {
          logger.log('Invalid JSON');
        }
        if (data) {
          data = _.pick(data, _.keys(app.pin.defaults));
          app.pin.set(data);
          if (app.pin.changed.pin_is_locked_out === true) {
            return;
          }
        }

        if (textStatus === 'timeout') {
          logger.log('Request timed out');
          utils.trackEvent({action: pinCheckAction,
                            label: 'Pin Check API Call Timed Out'});
          return app.error.render({
            ctaText: that.gettext('Retry?'),
            errorCode: 'PIN_ENTER_TIMEOUT',
            ctaCallback: function(e) {
              e.preventDefault();
              that.handleSubmit();
            }
          });

        } else if ($xhr.status === 400) {
          logger.log('Wrong pin');
          utils.trackEvent({action: pinCheckAction,
                            label: 'Pin Check API Call Invalid Form Data'});
          pin.resetPinUI();
          utils.trackEvent({'action': 'pin form',
                            'label': 'Wrong PIN'});
          pin.showError(that.gettext('Wrong PIN'), {showForgotPin: true});
        } else if ($xhr.status === 403) {
          logger.log('User not authenticated');
          utils.trackEvent({action: pinCheckAction,
                            label: 'Pin Check API Call Permission Denied'});
          return app.error.render({errorCode: 'PIN_ENTER_PERM_DENIED'});
        } else if ($xhr.status === 404) {
          logger.log("User doesn't exist");
          utils.trackEvent({action: pinCheckAction,
                            label: "Pin Check API Call User Doesn't exist"});
          return app.error.render({errorCode: 'PIN_ENTER_NO_USER'});
        } else {
          logger.log("Unhandled error");
          utils.trackEvent({action: pinCheckAction,
                            label: 'Pin Check API Call Unhandled error'});
          return app.error.render({errorCode: 'PIN_ENTER_ERROR'});
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
