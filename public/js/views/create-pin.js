define([
  'jquery',
  'backbone',
  'nunjucks'
], function($, Backbone, nunjucks){
  var CreatePinView = Backbone.View.extend({
    el: $('#app'),
    render: function(){
      var data = {
        heading: 'Create Pin'
      };
      var template = nunjucks.render('create-pin.html', data);
      this.$el.append(template);
      return this;
    }
  });
  // Our module now returns our view
  return CreatePinView;
});
