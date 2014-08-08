define([
  'backbone',
], function(Backbone) {

  'use strict';

  var BaseModel = Backbone.Model.extend({

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

  return BaseModel;
});
