define([
  'jquery',
  'underscore',
  'backbone',
  'gettext',
  'log',
  'nunjucks',
  'templates',
], function($, _, Backbone, gettext, log, nunjucks){

  var console = log('view', 'base');
  var prefix = 'Webpay | ';

  var BaseView = Backbone.View.extend({
    el: $('#app'),
    gettext: gettext.gettext,
    setTitle: function setTitle(title) {
      // Update the title element in the page.
      $('title').text(prefix + title);
    },
    renderTemplate: function renderTemplate(template, data) {
      // Chainable shortcut for rendering the template.
      this.$el.append(this.template(template, data));
      console.log('appending rendered content');
      return this;
    },
    template: function(template, data){
      // Builds the specified template with data.
      data = data || {};
      // Add gettext to context.
      _.extend(data, {gettext: gettext.gettext});
      console.log('building template: ' + template);
      return nunjucks.render(template, data);
    }
  });
  return BaseView;
});
