define([
  'auth',
  'cancel',
  'id',
  'jquery',
  'log',
  'settings',
  'underscore',
  'utils',
  'views/base'
], function(auth, cancel, id, $, log, settings, _, utils, BaseView){

  'use strict';

  var console = log('view', 'force-auth');
  var ForceAuthView = BaseView.extend({

    loginDeferred: null,
    forceAuthTimer: null,

    events: {
      'click #signin': 'handleSignInClick'
    },

    setupLoginListener: function() {
      var that = this;
      this.loginDeferred = $.Deferred();

      // Tell the app to temporarily stop listening to login events.
      app.AppView.stopSessionListener('onlogin');

      this.loginDeferred.always(function() {
        console.log('Re-starting app onlogin listener');
        // Kill event in-case it wasn't ever fired.
        that.stopListening(app.session, 'onlogin', that.handlePersonaLogin);
        // Always restart the app logout listener.
        app.AppView.startSessionListener('onlogin');
      });

      // Setup a one-off listener to handle login as part of the
      // forceAuth step.
      this.listenToOnce(app.session, 'onlogin', function(assertion) {
        this.handlePersonaLogin(assertion);
        this.loginDeferred.resolve();
      });
    },

    handlePersonaLogin: function(assertion) {
      // Do the reverification step now.
      console.log('re-auth login happened. moving to re-verify');
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

      // Reject the login deferred to reset listeners.
      if (this.loginDeferred) {
        console.log('Rejecting login deferred');
        this.loginDeferred.reject();
      }

      app.error.render({
        context: {
          ctaText: that.gettext('Retry?'),
          errorCode: 'REAUTH_LOGIN_TIMEOUT'
        },
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
      this.setupLoginListener();
      this.forceAuthTimer = window.setTimeout(_.bind(this.onForceAuthTimeout, this), settings.login_timeout);
      app.error.hide();
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
      app.throbber.hide();
      return this;
    },

  });

  return ForceAuthView;
});
