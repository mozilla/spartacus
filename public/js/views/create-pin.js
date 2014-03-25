define([
  'lib/pin',
  'log',
  'views/base-pin',
], function(pin, log, BasePinView){

  'use strict';

  var gettext = BasePinView.prototype.gettext;

  var CreatePinView = BasePinView.extend({

    // Two Stage Pin Form
    stageOneTitle: gettext('Create Pin'),
    stageTwoTitle: gettext('Confirm Pin'),

    submitStageTwo: function(pinData) {
      app.user.createPin(pinData);
    }

  });

  // Our module now returns our view
  return CreatePinView;
});
