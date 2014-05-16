define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'utils'
], function($, _, Backbone, log, utils){

  'use strict';

  var console = log('model', 'pin');
  var baseApiURL = (utils.bodyData.baseApiURL || window.location.origin) + '/mozpay/v1/api/pin/';

  var PinModel = Backbone.Model.extend({

    initialize: function(){
      console.log('Initing PinModel');
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
      'create': {'url': baseApiURL },
      'read': {'url': baseApiURL },
      'update': {'url': baseApiURL },
      'check': {'url': baseApiURL + 'check/', 'method': 'POST', 'crudMethod': 'create'},
    },

    sync: function(crudMethod, model, options) {
      if (model.urlLookup && model.urlLookup[crudMethod]) {
        var crudMethodData = model.urlLookup[crudMethod];
        options = options || {};
        options.url = crudMethodData.url;

        // Set the HTTP method if defined.
        if (crudMethodData.method) {
          options.method = crudMethodData.method;
        }
        if (crudMethodData.crudMethod) {
          crudMethod = crudMethodData.crudMethod;
        }
      }
      if (options.data) {
        options.data = JSON.stringify(options.data);
        options.contentType = 'application/json';
        options.dataType = 'json';
      }
      return Backbone.sync(crudMethod, model, options);
    }
  });

  return PinModel;
});
