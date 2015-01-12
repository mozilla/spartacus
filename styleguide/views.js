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
      code: utils.prettyTemplateRender('pin-form.html', req),
      iframe: 'create-pin',
      active_page: 'create-pin'
    });
  },

  error: function(req, res) {
    res.render('pages/error.html', {
      code: utils.prettyTemplateRender('error.html', req, context.error),
      iframe: 'error',
      active_page: 'error'
    });
  },

  iframeoverlay: function(req, res) {
    res.render('pages/iframe-overlay.html', {
      code: utils.prettyTemplateRender('iframe-overlay.html', req, context.iframeoverlay),
      iframe: 'iframe-overlay',
      active_page: 'iframe-overlay',
      tui_only: true
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
      code: utils.prettyTemplateRender('was-locked.html', req),
      iframe: 'was-locked',
      active_page: 'was-locked'
    });
  },

  locked: function(req, res) {
    res.render('pages/locked.html', {
      code: utils.prettyTemplateRender('error.html', req, context.locked),
      iframe: 'locked',
      active_page: 'locked'
    });
  },

  login: function(req, res) {
    res.render('pages/login.html', {
      code: utils.prettyTemplateRender('login.html', req, context.login),
      iframe: 'login',
      active_page: 'login'
    });
  },

  signout: function(req, res) {
    res.render('pages/signout.html', {
      code: utils.prettyTemplateRender('signout.html', req, context.signout),
      iframe: 'signout',
      active_page: 'signout'
    });
  },
};
