define([
  'jquery',
  'underscore',
  'models/base',
  'utils'
], function($, _, BaseModel, utils){

  'use strict';

  var baseApiURL = utils.apiUrl('simulate');

  var SimulateModel = BaseModel.extend({
    url: baseApiURL,

    urlLookup: {
      'create': {'url': baseApiURL},
    },

    begin: function() {
      return this.sync('create', this,  {});
    },
  });

  return SimulateModel;
});
