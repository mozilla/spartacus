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
  'jquery',
  'log',
  'settings',
  'underscore',
  'utils',
  'views/page',
], function(auth, cancel, $, log, settings, _, utils, PageView){

  'use strict';

  var logger = log('views', 'reset-start');

  var ResetStartView = PageView.extend({

    resetLogoutTimeout: null,

    events: {
      'click .back': 'handleBack',
      'click .cta:enabled': 'handleResetStart',
    },

    handleBack: function(e) {
      e.preventDefault();
      app.router.showEnterPin();
    },

    handlePersonaLogout: function() {
      app.session.set({logged_in: false}, {silent: true});
      this.deferredLogout.resolve();
    },

    // Wrap logout in deferred.
    logoutPersona: function() {
      this.deferredLogout = $.Deferred();
      if (app.session.get('logged_in') === true) {
        logger.log('Logging out of Persona');
        navigator.id.logout();
      } else {
        logger.log('Already logged out of Persona resolving the deferred.');
        this.deferredLogout.resolve();
      }
      return this.deferredLogout;
    },

    handleResetStart: function(e) {
      logger.log('Running handleResetStart');
      var that = this;

      if (e) {
        e.preventDefault();
      }

      if (utils.useOAuthFxA()) {
        app.throbber.render(this.gettext('Connecting to Firefox Accounts'));
      } else {
        app.throbber.render(this.gettext('Connecting to Persona'));
      }

      var authResetUser = auth.resetUser();
      var personaLogout = null;
      if (utils.useOAuthFxA()) {
        personaLogout = $.Deferred().resolve();
      } else {
        personaLogout = this.logoutPersona();
      }

      if (this.resetLogoutTimeout) {
        window.clearTimeout(this.resetLogoutTimeout);
      }

      logger.log('starting logout timer.');
      this.resetLogoutTimeout = window.setTimeout(function() {
        // If the log-out times-out then abort/reject the requests/deferred.
        logger.log('logout timed-out');
        authResetUser.abort();
        personaLogout.reject();
      }, settings.logout_timeout);

      $.when(authResetUser, personaLogout)
        .done(function _allLoggedOut() {
          logger.log('Clearing logout reset timer.');
          window.clearTimeout(that.resetLogoutTimeout);
          logger.log('Forgot-pin logout done');
          utils.trackEvent({'action': 'forgot pin',
                            'label': 'Logout Success'});

          if (utils.useOAuthFxA()) {
            app.transaction.saveJWT();
            sessionStorage.setItem('fxa-reverification', 'true');
            window.location.href = utils.bodyData.fxaAuthUrl +
              '&email=' + encodeURIComponent(app.session.get('logged_in_user'));
          } else {
            // Call directly rather than change the URL to workaround bug 1063575.
            app.router.showForceAuth();
          }

        })

        .fail(function _failedLogout() {
          // Called when we manually abort everything
          // or if something fails.
          logger.log('Clearing logout reset timer.');
          window.clearTimeout(that.resetLogoutTimeout);
          utils.trackEvent({'action': 'forgot pin',
                            'label': 'Logout Error'});
          // This can be a timeout or a failure. So a more generic message is needed.
          return app.error.render({
            ctaText: that.gettext('Retry?'),
            errorCode: 'LOGOUT_ERROR',
            ctaCallback: function(e) {
              that.handleResetStart(e);
            }
          });
        });
    },

    render: function(){
      logger.log('rendering reset-start view');
      this.setTitle(this.gettext('Reset your PIN?'));
      this.renderTemplate('reset-start.html');
      app.throbber.close();
      return this;
    },

  });

  return ResetStartView;
});
