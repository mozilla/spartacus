define([
  'jquery',
  'backbone',
  'nunjucks'
], function($, Backbone, nunjucks){
  var LoginView = Backbone.View.extend({
    el: $('#app'),
    render: function(){
      var data = {
        heading: 'Login'
      };
      var template = nunjucks.render('login.html', data);
      this.$el.append(template);
      return this;
    }
  });
  // Our module now returns our view
  return LoginView;
});
