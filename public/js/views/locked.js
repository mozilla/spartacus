define([
  'jquery',
  'backbone',
  'nunjucks'
], function($, Backbone, nunjucks){
  var LockedView = Backbone.View.extend({
    el: $('#app'),
    render: function(){
      var data = {
        heading: 'Locked'
      };
      var template = nunjucks.render('locked.html', data);
      this.$el.append(template);
      return this;
    }
  });
  // Our module now returns our view
  return LockedView;
});
