define([
  'jquery',
  'underscore',
  'models/base',
  'log',
  'utils'
], function($, _, BaseModel, log, utils){

  'use strict';

  var logger = log('models', 'pin');
  var baseApiURL = utils.apiUrl('pin');

  var PinModel = BaseModel.extend({

    initialize: function(){
      logger.log('Initing PinModel');
    },

    defaults: {
      // Whether the user has a pin.
      pin: null,
      // Date object for when the pin was locked.
      pin_locked_out: null,
      // If the user has a locked pin
      pin_is_locked_out: null,
      // If the user was previously locked out.
      pin_was_locked_out: null,
    },

    url: baseApiURL,

    urlLookup: {
      // There's no 'check' in CRUD but this allows us to use the check
      // endpoint as it shares the attrs of this model.
      'create': {'url': baseApiURL},
      'read': {'url': baseApiURL},
      'update': {'url': baseApiURL, 'method': 'PATCH'},
      'check': {'url': baseApiURL + 'check/',
                'method': 'POST', 'crudMethod': 'create'},
    }
  });

  return PinModel;
});
