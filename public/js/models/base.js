// Base Model. Define things here we want to be on all our models.
define([
  'backbone',
  'i18n-abide-utils',
], function(Backbone, i18n){

  var BaseModel = Backbone.Model.extend({
    gettext: i18n.gettext,
  });

  return BaseModel;
});
