var context = require('./context');

module.exports = {
  // Iframe Pages (Pages rendered in an iframe for live display.
  buttons: function(req, res) {
    res.render('iframed/buttons.html');
  },

  createpin: function(req, res) {
    res.render('iframed/create-pin.html', context.pinForm);
  },

  error: function(req, res) {
    res.render('iframed/error.html', context.error);
  },

  iframeoverlay: function(req, res) {
    res.render('iframed/iframe-overlay.html', context.iframeoverlay);
  },

  throbber: function(req, res) {
    res.render('iframed/throbber.html');
  },

  typography: function(req, res) {
    res.render('iframed/typography.html');
  },

  waslocked: function(req, res) {
    res.render('iframed/was-locked.html');
  },

  locked: function(req, res) {
    res.render('iframed/locked.html', context.locked);
  },

  signout: function(req, res) {
    res.render('iframed/signout.html', context.signout);
  },
};
