var utils = require('./utils');
var context = require('./context');

module.exports = {

  // Styleguide page views.
  index: function(req, res) {
    res.render('index.html');
  },

  buttons: function(req, res) {
    res.render('pages/buttons.html', {
      code: utils.prettyTemplateRender('examples/buttons.html', req),
      iframe: 'buttons',
      active_page: 'buttons'
    });
  },

  createpin: function(req, res) {
    res.render('pages/create-pin.html', {
      code: utils.prettyTemplateRender('create-pin.html', req),
      iframe: 'create-pin',
      active_page: 'create-pin'
    });
  },

  error: function(req, res) {
    res.render('pages/error.html', {
      code: utils.prettyTemplateRender('base-error.html', req, context.error),
      iframe: 'error',
      active_page: 'error'
    });
  },

  throbber: function(req, res) {
    res.render('pages/throbber.html', {
      code: utils.prettyTemplateRender('throbber.html', req),
      iframe: 'throbber',
      active_page: 'throbber'
    });
  },

  typography: function(req, res) {
    res.render('pages/typography.html', {
      code: utils.prettyTemplateRender('examples/typography.html', req),
      iframe: 'typography',
      active_page: 'typography'
    });
  },

  waslocked: function(req, res) {
    res.render('pages/was-locked.html', {
      code: utils.prettyTemplateRender('was-locked.html', req, context.error),
      iframe: 'was-locked',
      active_page: 'was-locked'
    });
  },

};
