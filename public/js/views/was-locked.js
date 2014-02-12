define([
  'jquery',
  'backbone',
  'nunjucks'
], function($, Backbone, nunjucks){
  var WasLockedView = Backbone.View.extend({
    el: $('#app'),
    render: function(){
      var data = {
        heading: 'Was Locked'
      };
      var template = nunjucks.render('was-locked.html', data);
      this.$el.append(template);
      return this;
    }
  });
  // Our module now returns our view
  return WasLockedView;
});
