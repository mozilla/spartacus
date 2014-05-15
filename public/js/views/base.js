define([
  'backbone',
  'i18n-abide-utils',
  'jquery',
  'log',
  'nunjucks',
  'templates',
  'underscore'
], function(Backbone, i18n, $, log, nunjucks, templates, _){

  'use strict';

  var console = log('view', 'base');
  var prefix = 'Webpay | ';

  var BaseView = Backbone.View.extend({
    el: '#view',
    gettext: i18n.gettext,
    format: i18n.format,

    initialize: function() {
      // Unbind any current events as we create a new view.
      console.log('Unbinding events');
      $(this.el).unbind();
    },

    setTitle: function setTitle(title) {
      // Update the title element in the page.
      $('title').text(prefix + title);
    },

    template: function(template, data){
      // Builds the specified template with data.
      data = data || {};
      // Add gettext to context.
      _.extend(data, {
        gettext: i18n.gettext,
        format: i18n.format
      });
      return nunjucks.render(template, data);
    },

    renderTemplate: function renderTemplate(template, data) {
      // Chainable shortcut for rendering the template.
      this.$el.html(this.template(template, data));
      // Needed in casper.
      if (window._phantom) {
        console.log('Forcing a repaint for casper');
        this.$el.parent().toggleClass('repaint');
      }
      console.log('Replacing $el with rendered content');
      return this;
    },

    clear: function clear() {
      // Remote the content in the view.
      this.$el.empty();
      // Disconnect the view's event handlers.
      this.unbind();
    },

    getSelectorText: function(selector) {
      return this.$el.find(selector).text();
    },

    updateSelectorText: function(selector, text) {
      this.$el.find(selector).text(text);
      return this.$el;
    }

  });
  return BaseView;
});
