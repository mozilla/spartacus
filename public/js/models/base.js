// Base Model. Define things here we want to be on all our models.
define([
  'backbone',
  'i18n-abide-utils',
  'log',
  'utils',
], function(Backbone, i18n, log, utils){

  'use strict';

  var console = log('BaseModel');

  var BaseModel = Backbone.Model.extend({
    gettext: i18n.gettext,

    baseURL: utils.bodyData.baseApiURL || window.location.origin,

    basePath: '/mozpay/v1/api',

    getURL: function(pathSuffix) {
      return this.baseURL + this.basePath + pathSuffix;
    },

    fetch: function() {
      console.log('fetch method not used (noop)');
    },

    sync: function() {
      console.log('sync method not used (noop)');
    },

  });

  return BaseModel;
});
