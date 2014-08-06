define([
  'auth',
  'cancel',
  'id',
  'jquery',
  'log',
  'settings',
  'underscore',
  'utils',
  'views/page'
], function(auth, cancel, id, $, log, settings, _, utils, PageView){

  'use strict';

  var console = log('view', 'force-auth');
  var ForceAuthView = PageView.extend({

    forceAuthTimer: null,

    events: {
      'click #signin': 'handleSignInClick'
    },

    handlePersonaLogin: function(assertion) {
      // Override handlePersonaLogin for re-verification.
      console.log('re-auth login happened. moving to re-verify');
      // Render a generic loading throbber to cover us until the
      // verification moves us to reset.
      app.throbber.render();
      // Close the error in-case one was shown when the timeout fired.
      // This callback being fired means re-auth was successful so we
      // can clear the timeout error.
      app.error.close();
      window.clearTimeout(this.forceAuthTimer);
      auth.verifyUser(assertion, {reverify: true});
    },

    handleSignInClick: function(e) {
      e.preventDefault();
      this.forceReAuthentication();
    },

    onForceAuthTimeout: function() {
      var that = this;
      console.log('force auth timed-out');
      utils.trackEvent({'action': 'reset force auth',
                        'label': 'Log-in Timeout'});
      if (this.forceAuthTimer) {
        console.log('Clearing Reset login timer');
        window.clearTimeout(this.forceAuthTimer);
      }

      return app.error.render({
        ctaText: that.gettext('Retry?'),
        errorCode: 'REAUTH_LOGIN_TIMEOUT',
        ctaCallback: function(e) {
          e.preventDefault();
          that.forceReAuthentication();
        }
      });
    },

    forceAuthRequest: function() {
      id.request({
        experimental_forceAuthentication: true,
        oncancel: function() {
          utils.trackEvent({'action': 'reset force auth',
                            'label': 'cancelled'});
          cancel.callPayFailure();
        }
      });
    },

    forceReAuthentication: function() {
      console.log('Starting forceAuthTimer');
      this.forceAuthTimer = window.setTimeout(_.bind(this.onForceAuthTimeout, this), settings.login_timeout);
      app.error.close();
      app.throbber.render(this.gettext('Connecting to Persona'));
      this.forceAuthRequest();
    },

    render: function(){
      console.log('rendering login view');
      this.setTitle(this.gettext('Sign-in to reset PIN'));
      this.renderTemplate('login.html', {
        heading: this.gettext('Reset PIN'),
        msg: this.gettext('Please sign in to reset your PIN.')
      });
      app.throbber.close();
      return this;
    },

  });

  return ForceAuthView;
});
