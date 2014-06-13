/*
 * This the flow for reset.
 *  - User gets to reset-start view.
 *  - User clicks reset to start the reset pin process
 *  - User is logged out (Persona/Provider/Webpay) and the default logout handler is overriden.
 *  - Assuming a succesful logout the user is then prompted to login.
 *  - The login happens via a customised navigator.id.request.
 *  - The login handler (added via a one-off listener) does a reVerification request.
 *  - Assuming that's successful the user should then be directed to reset-pin.
 */

define([
  'auth',
  'cancel',
  'id',
  'jquery',
  'log',
  'provider',
  'settings',
  'utils',
  'views/base',
], function(auth, cancel, id, $, log, provider, settings, utils, BaseView){

  'use strict';

  var console = log('view', 'reset-start');

  var ResetStartView = BaseView.extend({

    forceAuthTimer: null,
    resetLogoutTimer: null,

    initialize: function() {
      BaseView.prototype.initialize();
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

    events: {
      'click .back': 'handleBack',
      'click .cta:enabled': 'handleResetStart',
    },

    handleBack: function(e) {
      e.preventDefault();
      app.router.navigate('enter-pin', {trigger: true});
    },

    // Wrap logout in deferred.
    logoutPersona: function() {
      console.log('logging out persona');
      var logoutDeferred = $.Deferred();
      var that = this;

      // Tell the app to temporarily stop listening to logout events.
      // So we can noop the logout handling for reset.
      app.AppView.stopSessionListener('onlogout');

      function handleOnLogout() {
        console.log('Responding to one-off onlogout listener');
        // Update model but don't fire any events.
        app.session.set({logged_in: false}, {silent: true});
        logoutDeferred.resolve();
      }

      logoutDeferred.always(function() {
        console.log('Re-starting app onlogout listener');
        // Kill the one-off listener in-case it was never fired.
        that.stopListening(app.session, 'onlogout', handleOnLogout);
        // Always restart the app logout listener.
        app.AppView.startSessionListener('onlogout');
      });

      this.listenToOnce(app.session, 'onlogout', handleOnLogout);

      if (app.session.get('logged_in') === true) {
        console.log('Logging out of Persona');
        navigator.id.logout();
      } else {
        console.log('Already logged out of Persona resolving the deferred.');
        logoutDeferred.resolve();
      }

      return logoutDeferred;
    },

    handleResetStart: function(e) {
      console.log('Running handleResetStart');
      var that = this;

      if (e) {
        e.preventDefault();
      }

      app.throbber.render(this.gettext('Connecting to Persona'));

      var authResetUser = auth.resetUser();
      var providerLogout = provider.logout();
      var personaLogout = this.logoutPersona();

      if (this.resetLogoutTimeout) {
        window.clearTimeout(this.resetLogoutTimeout);
      }

      console.log('starting logout timer.');
      this.resetLogoutTimeout = window.setTimeout(function() {
        // If the log-out times-out then abort/reject the requests/deferred.
        console.log('logout timed-out');
        authResetUser.abort();
        providerLogout.reject();
        personaLogout.reject();
      }, settings.logout_timeout);

      $.when(authResetUser, providerLogout, personaLogout)
        .done(function _allLoggedOut() {
          console.log('Clearing logout reset timer.');
          window.clearTimeout(that.resetLogoutTimeout);
          console.log('Forgot-pin logout done');
          utils.trackEvent({'action': 'forgot pin',
                            'label': 'Logout Success'});
          that.forceReAuthentication();
        })
        .fail(function _failedLogout() {
          // Called when we manually abort everything
          // or if something fails.
          console.log('Clearing logout reset timer.');
          window.clearTimeout(that.resetLogoutTimeout);
          utils.trackEvent({'action': 'forgot pin',
                            'label': 'Logout Error'});
          // This can be a timeout or a failure. So a more generic message is needed.
          app.error.render({
            context: {
              ctaText: that.gettext('Retry?'),
              errorCode: 'LOGOUT_ERROR'
            },
            events: {
              'click .button.cta': function(e) {
                that.handleResetStart(e);
              }
            }
          });
        });
    },

    render: function(){
      console.log('rendering reset-start view');
      this.setTitle(this.gettext('Reset your PIN?'));
      this.renderTemplate('reset-start.html');
      app.throbber.hide();
      return this;
    },

    onForceAuthTimeout: function() {
      var that = this;
      utils.trackEvent({'action': 'reset force auth',
                        'label': 'Log-in Timeout'});
      if (this.forceAuthTimer) {
        console.log('Clearing Reset login timer');
        window.clearTimeout(this.forceAuthTimer);
      }
      // Reject the login deferred to reset listeners.
      this.loginDeferred.reject();
      app.error.render({
        context: {
          ctaText: that.gettext('Retry?'),
          errorCode: 'REAUTH_LOGIN_TIMEOUT'
        },
        events: {
          'click .button.cta': function(e) {
            that.forceReAuthentication(e);
          }
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
      this.forceAuthTimer = window.setTimeout(this.onForceAuthTimeout, settings.login_timeout);
      app.throbber.render(this.gettext('Connecting to Persona'));
      this.setupLoginListener();
      this.forceAuthRequest();
    },

    handlePersonaLogin: function(assertion) {
      // Do the reverification step now.
      console.log('re-auth login happened. moving to re-verify');
      window.clearTimeout(this.forceAuthTimer);
      auth.verifyUser(assertion, {reverify: true});
    }

  });

  return ResetStartView;
});
