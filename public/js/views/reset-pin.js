define([
  'lib/pin',
  'log',
  'views/base-pin',
], function(pin, log, BasePinView){

  'use strict';

  var gettext = BasePinView.prototype.gettext;

  var ResetPinView = BasePinView.extend({

    // Two Stage Pin Form
    stageOneTitle: gettext('Reset Pin'),
    stageTwoTitle: gettext('Confirm Pin'),

    stageTwoButtonText: gettext('Reset Pin'),

    submitStageTwo: function(pinData) {
      app.user.resetPin(pinData);
    }

  });

  // Our module now returns our view
  return ResetPinView;
});
