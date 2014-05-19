define([
  'auth',
  'backbone',
  'cancel',
  'i18n',
  'jquery',
  'log',
  'models/pin',
  'models/session',
  'models/transaction',
  'router',
  'underscore',
  'utils',
  'views/throbber',
  'views/error'
], function(auth, Backbone, cancel, i18n, $, log, PinModel, SessionModel, TransactionModel, AppRouter, _, utils, ThrobberView, ErrorView) {

  'use strict';

  var console = log('view', 'app');

  var AppView = Backbone.View.extend({

    el: '#app',

    initialize: function() {
      console.log("Initing app view");

      // Create Model Instances.
      app.session = new SessionModel();
      app.pin = new PinModel();
      app.transaction = new TransactionModel();

      // Create overlaid view instances.
      app.throbber = new ThrobberView();
      app.error = new ErrorView();

      // If the start url isn't /mozpay/?req=[jwt] then we should
      // bail.
      if (window.location.pathname !== '/mozpay/') {
        app.error.render({context: {'errorCode': 'INVALID_START'},
                          showCancel: false,
                          events: {'click .button.cta': cancel.callPayFailure}});
        return;
      }

      // Create the router instance and fire-up history.
      app.router = new AppRouter();
      Backbone.history.start({pushState: true, root: app.router.root});

      // Init Model event listeners;
      this.listenTo(app.session, 'onlogout', this.handlePersonaLogout);
      this.listenTo(app.session, 'onlogin', this.handlePersonaLogin);
      this.listenTo(app.session, 'change:logged_in', this.handleLoginStateChange);
      this.listenTo(app.pin, 'change', this.handlePinStateChange);

      i18n.initLocale(_.bind(function(){
        // Extract JWT for use post-login.
        if (app.transaction.setJWT() === false) {
          utils.trackEvent({action: 'extract jwt before login',
                            label: 'Invalid or missing JWT'});
          app.error.render({context: {'errorCode': 'INVALID_JWT'},
                            showCancel: false,
                            events: {'click .button.cta': cancel.callPayFailure}});
        } else {
          console.log('Starting login');
          app.session.watchIdentity();
        }
      }, this));

      return this;
    },

    // Persona has told use we should be logged out.
    handlePersonaLogout: function() {
      // TODO: Nothing is tied to the resetUser success or failure. Is this ok?
      auth.resetUser();
      // This will result in the login screen appearing.
      app.session.set('logged_in', false);
    },

    // Persona has told use we should be logged out.
    handlePersonaLogin: function(assertion) {
      // Persona has told us we should be logged-in.
      auth.verifyUser(assertion);
    },

    // Deal with the logged-in attribute state change.
    handleLoginStateChange: function(model, value) {
      console.log('logged_in state changed to ' + value);
      if (value === false) {
        console.log('navigating to /login');
        app.router.navigate('login', {trigger: true});
      } else {
        // Retrieve the JWT we store prior to login.
        var jwt = app.transaction.get('jwt');
        if (jwt) {
          var req = app.transaction.startTransaction(jwt);
          req.done(function() {
            console.log('Transaction started successfully');
            utils.trackEvent({action: 'start-transaction',
                              label: 'Transaction started successfully'});
            app.pin.fetch();
          }).fail(function($xhr, textStatus) {
            console.log($xhr.status);
            console.log(textStatus);
            utils.trackEvent({action: 'start-transaction',
                              label: 'Transaction failed to start'});
            app.error.render({'context': {'errorCode': 'FAILED_TO_START_TRANSACTION'}, showCta: false});
          });
        } else {
          utils.trackEvent({action: 'start-transaction',
                            label: 'Invalid or missing JWT'});
          app.error.render({context: {'errorCode': 'INVALID_JWT'},
                            showCancel: false,
                            events: {'click .button.cta': cancel.callPayFailure}});
        }
      }
    },

    // Work out what to do when the pin state changes.
    // Note: This *only* looks at *changed* data.
    handlePinStateChange: function(model) {
      console.log('Checking changed pin state data');
      var data = model.changed;
      if (data.pin_is_locked_out === true) {
        console.log('User is locked out -> locked');
        return app.router.navigate('locked', {trigger: true});
      } else if (data.pin_was_locked_out === true) {
        console.log('User was-locked out -> was-locked');
        return app.router.navigate('was-locked', {trigger: true});
      } else if (data.pin === true) {
        console.log('User has a pin so -> enter-pin');
        return app.router.navigate('enter-pin', {trigger: true});
      } else {
        console.log('User has no pin so -> create-pin');
        return app.router.navigate('create-pin', {trigger: true});
      }
    },

  });

  return AppView;
});
