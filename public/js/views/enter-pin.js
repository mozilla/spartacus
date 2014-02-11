define([
  'jquery',
  'backbone',
  'nunjucks'
], function($, Backbone, nunjucks){
  var EnterPinView = Backbone.View.extend({
    el: $('#app'),
    render: function(){
      var data = {
        heading: 'Enter Pin'
      };
      var template = nunjucks.render('enter-pin.html', data);
      this.$el.append(template);
      return this;
    }
  });
  // Our module now returns our view
  return EnterPinView;
});
