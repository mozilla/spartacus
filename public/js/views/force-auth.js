define([
  'auth',
  'cancel',
  'jquery',
  'log',
  'settings',
  'underscore',
  'utils',
  'views/page'
], function(auth, cancel, $, log, settings, _, utils, PageView){

  'use strict';

  var logger = log('views', 'force-auth');
  var ForceAuthView = PageView.extend({

    forceAuthTimer: null,

    events: {
      'click #signin': 'handleSignInClick'
    },

    handlePersonaLogin: function(assertion) {
      // Override handlePersonaLogin for re-verification.
      logger.log('re-auth login happened. moving to re-verify');
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
      if (utils.useOAuthFxA()) {
        app.transaction.saveJWT();
        sessionStorage.setItem('fxa-reverification', 'true');
        window.location.href = utils.bodyData.fxaAuthUrl +
          '&email=' + encodeURIComponent(app.session.get('logged_in_user'));
      } else {
        this.forceReAuthentication();
      }
    },

    onForceAuthTimeout: function() {
      var that = this;
      logger.log('force auth timed-out');
      utils.trackEvent({'action': 'reset force auth',
                        'label': 'Log-in Timeout'});
      if (this.forceAuthTimer) {
        logger.log('Clearing Reset login timer');
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
      if (utils.useOAuthFxA()) {
        auth.startFxA(true);
      } else {
        app.session.login({
          experimental_forceAuthentication: true,
          oncancel: function() {
            utils.trackEvent({'action': 'reset force auth',
                              'label': 'cancelled'});
            cancel.callPayFailure();
          }
        });
      }
    },

    forceReAuthentication: function() {
      logger.log('Starting forceAuthTimer');
      this.forceAuthTimer = window.setTimeout(_.bind(this.onForceAuthTimeout, this), settings.login_timeout);
      app.error.close();
      app.throbber.render(this.gettext('Connecting to Firefox Accounts'));
      this.forceAuthRequest();
    },

    render: function(){
      logger.log('rendering login view');
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
