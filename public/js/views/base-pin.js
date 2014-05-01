define([
  'cancel',
  'lib/pin',
  'log',
  'underscore',
  'views/base',
  'views/throbber'
], function(cancel, pin, log, _, BaseView, throbber){

  'use strict';

  // Base PIN View
  //
  // The pin view can be either a single stage pin-entry
  // where the pin is entered and then submitted e.g. Enter Pin
  // (The user's pin is setup and they're submitting it for validation)
  //
  // OR
  //
  // The Two stage pin view is when you have the initial view and then on
  // clicking "Continue" you are then prompted to confirm the pin
  // before it's submitted. When submitted the second time around it
  // is validated to match the first before being submitted.
  //
  // Usage notes:
  // * This base pin view defaults to two stage.
  // * If you want single stage then just override 'submitStageOne'

  var console = log('view', 'base-pin');

  var BasePinView = BaseView.extend({

    curPin: null,

    events: {
      'click .cancel': 'delegateCancel',
      'click .cta:enabled': 'delegateSubmit',
    },

    delegateCancel: function(e) {
      e.preventDefault();
      if (this.$el.hasClass('stage-one')) {
        this.cancelStageOne();
      } else if (this.$el.hasClass('stage-two')) {
        this.cancelStageTwo();
      }
    },

    delegateSubmit: function(e) {
      e.preventDefault();
      if (this.$el.hasClass('stage-one')) {
        this.submitStageOne(pin.getPin());
      } else if (this.$el.hasClass('stage-two')) {
        var pinData = {
          pin1: this.curPin,
          pin2: pin.getPin(),
        };
        if (pinData.pin1 === pinData.pin2) {
          this.submitStageTwo.call(this, pinData);
        } else {
          this.showStageOne();
          pin.showError(this.gettext('Pins do not match'));
        }
      }
    },

    submitStageOne: function() {
      this.showStageTwo();
    },

    cancelStageOne: function() {
      cancel.callPayFailure();
    },

    submitStageTwo: function() {
      console.log('submitStageTwo: Needs implementing in child class');
    },

    cancelStageTwo: function() {
      this.showStageOne();
    },

    showStageOne: function() {
      console.log('Showing Stage One');
      this.$el.removeClass('stage-two');
      this.$el.addClass('stage-one');
      this.setTitle(this.stageOneTitle);
      this.$el.find('h1').text(this.stageOneTitle);
      this.updateButtonText(this.stageOneButtonText || this.gettext('Continue'));
      this.curPin = '';
      pin.resetPinUI();
      pin.focusPin();
    },

    showStageTwo: function() {
      console.log('Showing Stage Two');
      this.$el.removeClass('stage-one');
      this.$el.addClass('stage-two');
      this.setTitle(this.stageTwoTitle);
      this.$el.find('h1').text(this.stageTwoTitle);
      this.updateButtonText(this.stageTwoButtonText || this.gettext('Submit'));
      this.curPin = pin.getPin();
      pin.resetPinUI();
      pin.focusPin();
    },

    updateButtonText: function(text) {
      this.$el.find('.cta').text(text);
    },

    render: function(extraContext){
      console.log('rendering...');
      var context = {
        buttonText: this.stageOneButtonText || this.gettext('Continue'),
        pinTitle: this.stageOneTitle
      };
      _.extend(context, extraContext || {});
      this.renderTemplate('pin-form.html', context);
      this.$el.addClass('stage-one');
      pin.init();
      throbber.hide();
      return this;
    }

  });
  // Our module now returns our view
  return BasePinView;
});
