/*
 * This the flow for reset.
 *  - User gets to reset-start view.
 *  - User clicks reset to start the reset pin process
 *  - User is logged out (Persona/Provider/Webpay) and the default logout handler is overriden.
 *  - Assuming a succesful logout the user is then prompted to login.
 *  - The login happens via a customised navigator.id.request / navigator.id.watch
 *  - The logout handler is specialized to do a special reVerification step.
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

    reAuthTimer: null,
    resetLogoutTimer: null,

    initialize: function() {
      BaseView.prototype.initialize();
      this.listenTo(app.session, 'onlogin-force-auth', this.handlePersonaLogin);
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
      var def = $.Deferred();

      // Tell the app to temporarily stop listening to logout events.
      // So we can noop the logout handling for reset.
      app.AppView.stopLogoutListener();

      def.always(function() {
        // Always restart the app logout listener.
        console.log('Re-starting app onlogout listener');
        app.AppView.startLogoutListener();
      });

      this.listenToOnce(app.session, 'onlogout', function() {
        console.log('Responding to one-off onlogout listener');
        // Update model but don't fire any events.
        app.session.set({logged_in: false}, {silent: true});
        def.resolve();
      });

      if (app.session.get('logged_in') === true) {
        console.log('Logging out of Persona');
        navigator.id.logout();
      } else {
        console.log('Already logged out of Persona resolving the deferred.');
        def.resolve();
      }
      return def;
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
          window.clearTimeout(this.resetLogoutTimeout);
          console.log('Forgot-pin logout done');
          utils.trackEvent({'action': 'forgot pin',
                            'label': 'Logout Success'});
          that.forceReAuthentication();
        })
        .fail(function _failedLogout() {
          // Called when we manually abort everything
          // or if something fails.
          console.log('Clearing logout reset timer.');
          window.clearTimeout(this.resetLogoutTimeout);
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

    onResetLoginTimeout: function() {
      var that = this;
      utils.trackEvent({'action': 'reset force auth',
                        'label': 'Log-in Timeout'});
      if (this.reAuthTimer) {
        console.log('Clearing Reset login timer');
        window.clearTimeout(this.reAuthTimer);
      }
      app.error.render({
        context: {
          buttonText: that.gettext('Retry?'),
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
      console.log('Starting reAuthTimer');
      this.reAuthTimer = window.setTimeout(this.onResetLoginTimeout, settings.login_timeout);
      app.throbber.render(this.gettext('Connecting to Persona'));

      // Kick off watch for persona.
      app.session.watchIdentity({forceAuth: true});
      this.forceAuthRequest();
    },

    handlePersonaLogin: function() {
      // Do the reverification step now.
      console.log('re-auth login happened. moving to re-verify');
      window.clearTimeout(this.reAuthTimer);
      auth.reVerifyUser();
    }

  });

  return ResetStartView;
});
