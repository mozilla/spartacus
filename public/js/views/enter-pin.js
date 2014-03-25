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

  });

  // Our module now returns our view
  return EnterPinView;
});
