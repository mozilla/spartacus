define([
  'cancel',
  'jquery',
  'lib/pin-widget',
  'log',
  'underscore',
  'utils',
  'views/page'
], function(cancel, $, pin, log, _, utils, PageView){

  'use strict';

  var CreatePinView = PageView.extend({

    curPin: '',

    events: {
      'click .cancel': cancel.callPayFailure,
      'click .cta:enabled': 'handleContinue',
    },

    clearPin: function() {
      pin.resetPinUI();
      pin.focusPin();
    },

    handleContinue: function(e) {
      e.preventDefault();
      this._origEvents = _.clone(this.events);
      this.delegateEvents({
        'click .cancel': 'handleBack',
        'click .cta:enabled': 'handleSubmit',
      });
      this.curPin = pin.getPin();
      this._origHeading = this.getSelectorText('h1');
      this.updateSelectorText('h1', this.gettext('Confirm PIN'));
      this.updateSelectorText('.button.cancel', this.gettext('Back'));
      this.updateSelectorText('.button.cta', this.gettext('Submit'));
      this.clearPin();
    },

    handleSubmit: function(e) {
      e.preventDefault();
      if (this.curPin === pin.getPin()) {
        this.submitData(this.curPin);
      } else {
        this.clearPin();
        pin.showError(this.gettext('PINs do not match.'));
      }
    },

    submitData: function(pinData) {
      console.log('Sending pin for creation');
      var pinCreateAction = 'create-pin';
      var req = app.pin.sync('create', app.pin, {'data': {'pin': pinData}});
      var that = this;
      req.done(function() {
        app.router.navigate('spa/wait-to-start', {trigger: true});
      }).fail(function($xhr, textStatus) {
        if (textStatus === 'timeout') {
          console.log('Request timed out');
          utils.trackEvent({'action': pinCreateAction,
                            'label': 'Pin Create API Call Timed Out'});
          app.error.render({
            context: {
              ctaText: that.gettext('Retry?'),
              errorCode: 'CREATE_PIN_TIMEOUT'
            },
            ctaCallback: function(e){
              e.preventDefault();
              that.submitData(pinData);
            }
          });

        } else if ($xhr.status === 400) {
          console.log('Pin data invalid');
          utils.trackEvent({'action': pinCreateAction,
                            'label': 'Pin Create API Call Invalid Form Data'});
          app.error.render({context: {errorCode: 'PIN_CREATE_INVALID'}});
        } else if ($xhr.status === 403) {
          console.log('User not authenticated');
          utils.trackEvent({'action': pinCreateAction,
                            'label': 'Pin Create API Call Permission Denied'});
          app.error.render({context: {errorCode: 'PIN_CREATE_PERM_DENIED'}});
        } else if ($xhr.status === 404) {
          console.log("User doesn't exist");
          utils.trackEvent({'action': pinCreateAction,
                            'label': "Pin Create API Call User Doesn't exist"});
          app.error.render({context: {errorCode: 'PIN_CREATE_USER_DOES_NOT_EXIST'}});
        } else {
          console.log("Unhandled error");
          utils.trackEvent({'action': pinCreateAction,
                            'label': "Pin Create API Call Unhandled error"});
          app.error.render({context: {errorCode: 'PIN_CREATE_UNHANDLED_ERROR'}});
        }
      });
      return req;
    },

    handleBack: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.delegateEvents(this._origEvents);
      this.updateSelectorText('h1', this._origHeading);
      this.updateSelectorText('.button.cancel', this.gettext('Cancel'));
      this.updateSelectorText('.button.cta', this.gettext('Continue'));
      this.curPin = '';
      this.clearPin();
    },

    render: function(){
      var context = {
        ctaText: this.gettext('Continue'),
        pinTitle: this.gettext('Create PIN')
      };
      this.setTitle(this.gettext('Create PIN'));
      this.renderTemplate('pin-form.html', context);
      pin.init();
      app.throbber.close();
      return this;
    }

  });

  return CreatePinView;
});
