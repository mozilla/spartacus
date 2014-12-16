define([
  'cancel',
  'jquery',
  'log',
  'pin-widget',
  'underscore',
  'utils',
  'views/iframe-overlay',
  'views/page'
], function(cancel, $, log, pin, _, utils, IframeOverlayView, PageView){

  'use strict';

  var enterKeyCode = 13;
  var logger = log('views', 'create-pin');

  var CreatePinView = PageView.extend({

    curPin: '',

    events: {
      'click .cancel': cancel.callPayFailure,
      'click .cta:enabled': 'handleContinue',
      'keypress': function(e) {
        if ($('.cta:enabled').length && e.keyCode === enterKeyCode) {
          this.handleContinue(e);
        }
      },
      'click .tos': function(e) {
        e.preventDefault();
        this.openExtUrl(utils.getTermsLink(), utils.bodyData.termsOfService);
      },
      'click .pp': function(e) {
        e.preventDefault();
        this.openExtUrl(utils.getPrivacyLink(), utils.bodyData.privacyPolicy);
      }
    },

    clearPin: function() {
      pin.resetPinUI();
      pin.focusPin();
    },

    openExtUrl: function(iframeURL, nonIframeURL) {
      // If in the trusted UI, we show links in an iframe
      // otherwise, we open a window and use a standard link.
      // The iframed URL directly links to the CDN terms/privacy content
      // to minimise what's shown as part of the UI.
      logger.log('Iframe URL: ', iframeURL);
      logger.log('Non-iframe URL: ', nonIframeURL);

      if (window.open) {
        // Based on https://github.com/mozilla/persona/blob/dev/resources/static/dialog/js/modules/inline_tospp.js
        // A reference to the new window will be returned if the environment can
        // open one. If there is no reference, window.opened failed and the
        // TOS/PP should be shown in an iframe.
        var winRef = window.open(nonIframeURL);
        if (winRef) {
          logger.log('window.open ok - so returning');
          return;
        }
      }

      var IframedOverlay = new IframeOverlayView();
      IframedOverlay.render({iframeSrc: iframeURL});
    },

    handleContinue: function(e) {
      e.preventDefault();
      this._origEvents = _.clone(this.events);
      this.delegateEvents({
        'click .cancel': 'handleBack',
        'click .cta:enabled': 'handleSubmit',
        'keypress': function(e) {
          if ($('.cta:enabled').length && e.keyCode === enterKeyCode) {
            this.handleSubmit(e);
          }
        }
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
        if (e.target && e.target.nodeName === 'BUTTON') {
          $(e.target).prop('disabled', true);
        }
        this.submitData(this.curPin);
      } else {
        this.clearPin();
        utils.trackEvent({'action': 'pin form',
                          'label': 'Pins Do Not Match'});
        pin.showError(this.gettext('PINs do not match.'));
      }
    },

    submitData: function(pinData) {
      logger.log('Sending pin for creation');
      var pinCreateAction = 'create-pin';
      var req = app.pin.sync('create', app.pin, {'data': {'pin': pinData}});
      var that = this;
      req.done(function() {
        utils.trackEvent({'action': pinCreateAction,
                          'label': 'Pin Created Successfully'});
        app.router.showWaitToStart();
      }).fail(function($xhr, textStatus) {
        if (textStatus === 'timeout') {
          logger.log('Request timed out');
          utils.trackEvent({'action': pinCreateAction,
                            'label': 'Pin Create API Call Timed Out'});
          return app.error.render({
            ctaText: that.gettext('Retry?'),
            errorCode: 'PIN_CREATE_TIMEOUT',
            ctaCallback: function(e){
              e.preventDefault();
              that.submitData(pinData);
            }
          });

        } else if ($xhr.status === 400) {
          logger.log('Pin data invalid');
          utils.trackEvent({'action': pinCreateAction,
                            'label': 'Pin Create API Call Invalid Form Data'});
          return app.error.render({errorCode: 'PIN_CREATE_INVALID'});
        } else if ($xhr.status === 403) {
          logger.log('User not authenticated');
          utils.trackEvent({'action': pinCreateAction,
                            'label': 'Pin Create API Call Permission Denied'});
          return app.error.render({errorCode: 'PIN_CREATE_PERM_DENIED'});
        } else if ($xhr.status === 404) {
          logger.log("User doesn't exist");
          utils.trackEvent({'action': pinCreateAction,
                            'label': "Pin Create API Call User Doesn't exist"});
          return app.error.render({errorCode: 'PIN_CREATE_NO_USER'});
        } else {
          logger.log("Unhandled error");
          utils.trackEvent({'action': pinCreateAction,
                            'label': "Pin Create API Call Unhandled error"});
          return app.error.render({errorCode: 'PIN_CREATE_ERROR'});
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
        pinTitle: this.gettext('Create PIN'),
        showFxATerms: utils.useOAuthFxA(),
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
