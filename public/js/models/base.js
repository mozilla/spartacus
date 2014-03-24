// Base Model. Define things here we want to be on all our models.
define([
  'backbone',
  'i18n-abide-utils',
  'utils',
], function(Backbone, i18n, utils){

  'use strict';

  var BaseModel = Backbone.Model.extend({
    gettext: i18n.gettext,

    baseURL: utils.bodyData.baseApiURL || window.location.origin,

    basePath: '/mozpay/v1/api',

    getURL: function(pathSuffix) {
      return this.baseURL + this.basePath + pathSuffix;
    },

  });

  return BaseModel;
});
