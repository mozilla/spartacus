define([
  'jquery',
  'backbone',
  'nunjucks'
], function($, Backbone, nunjucks){
  var ResetPinView = Backbone.View.extend({
    el: $('#app'),
    render: function(){
      var data = {
        heading: 'Reset Pin'
      };
      var template = nunjucks.render('reset-pin.html', data);
      this.$el.append(template);
      return this;
    }
  });
  // Our module now returns our view
  return ResetPinView;
});
