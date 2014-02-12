define([
  'jquery',
  'backbone',
  'log',
  'nunjucks',
  'utils'
], function($, Backbone, log, nunjucks, utils){
  var console = log('view', 'base');
  var BaseView = Backbone.View.extend({
    el: $('#app'),
    setTitle: function setTitle(title) {
      // Update the title element in the page.
      utils.updateTitle(title);
    },
    renderTemplate: function renderTemplate(template, data) {
      // Chainable shortcut for rendering the template.
      this.$el.append(this.template(template, data));
      console.log('appending rendered content');
      return this;
    },
    template: function(template, data){
      // Builds the specified template with data.
      console.log('building template: ' + template);
      return nunjucks.render(template, data);
    }
  });
  return BaseView;
});
