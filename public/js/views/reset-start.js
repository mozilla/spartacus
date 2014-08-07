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
  'settings',
  'underscore',
  'utils',
  'views/page',
], function(auth, cancel, id, $, log, settings, _, utils, PageView){

  'use strict';

  var console = log('view', 'reset-start');

  var ResetStartView = PageView.extend({

    resetLogoutTimeout: null,

    events: {
      'click .back': 'handleBack',
      'click .cta:enabled': 'handleResetStart',
    },

    handleBack: function(e) {
      e.preventDefault();
      app.router.navigate('spa/enter-pin', {trigger: true});
    },

    handlePersonaLogout: function() {
      app.session.set({logged_in: false}, {silent: true});
      this.deferredLogout.resolve();
    },

    // Wrap logout in deferred.
    logoutPersona: function() {
      this.deferredLogout = $.Deferred();
      if (app.session.get('logged_in') === true) {
        console.log('Logging out of Persona');
        navigator.id.logout();
      } else {
        console.log('Already logged out of Persona resolving the deferred.');
        this.deferredLogout.resolve();
      }
      return this.deferredLogout;
    },

    handleResetStart: function(e) {
      console.log('Running handleResetStart');
      var that = this;

      if (e) {
        e.preventDefault();
      }

      app.throbber.render(this.gettext('Connecting to Persona'));

      var authResetUser = auth.resetUser();
      var personaLogout = this.logoutPersona();

      if (this.resetLogoutTimeout) {
        window.clearTimeout(this.resetLogoutTimeout);
      }

      console.log('starting logout timer.');
      this.resetLogoutTimeout = window.setTimeout(function() {
        // If the log-out times-out then abort/reject the requests/deferred.
        console.log('logout timed-out');
        authResetUser.abort();
        personaLogout.reject();
      }, settings.logout_timeout);

      $.when(authResetUser, personaLogout)
        .done(function _allLoggedOut() {
          console.log('Clearing logout reset timer.');
          window.clearTimeout(that.resetLogoutTimeout);
          console.log('Forgot-pin logout done');
          utils.trackEvent({'action': 'forgot pin',
                            'label': 'Logout Success'});
          app.router.navigate('spa/force-auth', {trigger: true});
        })
        .fail(function _failedLogout() {
          // Called when we manually abort everything
          // or if something fails.
          console.log('Clearing logout reset timer.');
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
      console.log('rendering reset-start view');
      this.setTitle(this.gettext('Reset your PIN?'));
      this.renderTemplate('reset-start.html');
      app.throbber.close();
      return this;
    },

  });

  return ResetStartView;
});
