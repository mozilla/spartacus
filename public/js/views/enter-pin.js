define([
  'lib/pin',
  'log',
  'views/base-pin',
], function(pin, log, BasePinView){

  'use strict';

  var gettext = BasePinView.prototype.gettext;

  var EnterPinView = BasePinView.extend({

    // Single Stage Pin Form
    stageOneTitle: gettext('Enter Pin'),

    submitStageOne: function(pinData) {
      app.user.checkPin(pinData);
    },

    render: function() {
      // Call super class render with extraContext.
      BasePinView.prototype.render.call(this, {'showForgotPin': true });
    }

  });

  // Our module now returns our view
  return EnterPinView;
});
