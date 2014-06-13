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

    listenerMap: {
      'onlogout': 'handlePersonaLogout',
      'onlogin': 'handlePersonaLogin'
    },

    personaCalledBack: false,

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

      // Bail early if initial url is below /mozpay/.
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
      this.listenTo(app.session, 'onready', this.handlePersonaReady);
      this.listenTo(app.session, 'change:logged_in', this.handleLoginStateChange);
      this.listenTo(app.pin, 'change', this.handlePinStateChange);

      i18n.initLocale(_.bind(function(){
        // Extract JWT for use post-login.
        var qs = window.queryString.parse(location.search) || {};
        var jwt = qs.req;
        if (!jwt) {
          utils.trackEvent({action: 'extract jwt before login',
                            label: 'Invalid or missing JWT'});
          app.error.render({context: {'errorCode': 'INVALID_JWT'},
                            showCancel: false,
                            events: {'click .button.cta': cancel.callPayFailure}});
        } else {
          app.transaction.set('jwt', jwt);
          console.log('Starting login');
          app.session.watchIdentity();
        }
      }, this));

      return this;
    },

    // Persona has told use we should be logged out.
    handlePersonaLogout: function() {
      console.log('Responding to onlogout event');
      // TODO: Nothing is tied to the resetUser success or failure. Is this ok?
      auth.resetUser();
      // This will result in the login screen appearing.
      this.personaCalledBack = true;
      app.session.set('logged_in', false);
    },

    // Persona has told us we should be logged-in.
    handlePersonaLogin: function(assertion) {
      console.log('Responding to onlogin event');
      this.personaCalledBack = true;
      auth.verifyUser(assertion);
    },

    // Browser's state matches loggedInUser so we're probably logged in.
    handlePersonaReady: function() {
      console.log('Probably logged in, Persona never called back');
      if (this.personaCalledBack === false && utils.bodyData.loggedInUser) {
        app.session.set('logged_in', true);
      }
    },

    stopSessionListener: function(eventName) {
      if (Object.keys(this.listenerMap).indexOf(eventName) > -1) {
        console.log('Stopping listening to "' + eventName + '" on app.session');
        this.stopListening(app.session, eventName);
      } else {
        console.log('Unknown event ' + eventName);
      }
    },

    startSessionListener: function(eventName) {
      if (Object.keys(this.listenerMap).indexOf(eventName) > -1) {
        var funcName = this.listenerMap[eventName];
        console.log('Starting listening to "' + eventName + '" on app.session with callback ' + funcName);
        this.listenTo(app.session, eventName, this[funcName]);
      } else {
        console.log('Unknown event ' + eventName);
      }
    },

    // Retrieve the JWT we store prior to login.
    setUpPayment: function() {
      var jwt = app.transaction.get('jwt');
      var that = this;
      if (jwt) {
        var req = app.transaction.startTransaction(jwt);
        req.done(function() {
          console.log('Transaction started successfully');
          utils.trackEvent({action: 'start-transaction',
                            label: 'Transaction started successfully'});
          app.pin.fetch().fail(function($xhr, textStatus) {
            if (textStatus === 'timeout') {
              utils.trackEvent({action: 'fetch-state',
                                label: 'Fetching initial state timed-out.'});
              app.error.render({'context': {'errorCode': 'PIN_STATE_TIMEOUT'},
                                events: {'click .button.cta': that.setUpPayment}});
            } else {
              utils.trackEvent({action: 'fetch-state',
                                label: 'Fecthing initial state error.'});
              app.error.render({'context': {'errorCode': 'PIN_STATE_ERROR'},
                                showCancel: false,
                                events: {'click .button.cta': cancel.callPayFailure}});
            }
          });
        }).fail(function($xhr, textStatus) {
          console.log($xhr.status);
          console.log(textStatus);
          if (textStatus === 'timeout') {
            utils.trackEvent({action: 'start-transaction',
                              label: 'Transaction start timed-out'});
            app.error.render({'context': {'errorCode': 'START_TRANS_TIMEOUT'},
                              events: {'click .button.cta': that.setUpPayment}});
          } else {
            utils.trackEvent({action: 'start-transaction',
                              label: 'Transaction failed to start'});
            app.error.render({'context': {'errorCode': 'START_TRANS_FAILURE'},
                              showCancel: false,
                              events: {'click .button.cta': cancel.callPayFailure}});
          }
        });
      } else {
        utils.trackEvent({action: 'start-transaction',
                          label: 'Invalid or missing JWT'});
        app.error.render({context: {'errorCode': 'INVALID_JWT'},
                          showCancel: false,
                          events: {'click .button.cta': cancel.callPayFailure}});
      }
    },


    // Deal with the logged-in attribute state change.
    handleLoginStateChange: function(model, value) {
      console.log('logged_in state changed to ' + value);
      if (value === false) {
        console.log('navigating to /login');
        app.router.navigate('login', {trigger: true});
      } else {
        // Process JWT and configure_transaction.
        this.setUpPayment();
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
