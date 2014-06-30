define([
  'auth',
  'log',
  'underscore',
  'utils',
  'views/base'
], function(auth, log, _, utils, BaseView){

  'use strict';

  var console = log('view', 'page');

  var PageView = BaseView.extend({

    personaCalledBack: false,

    initialize: function() {
      console.log('Page initialize');
      BaseView.prototype.initialize.call(this);
      // Init Model event listeners;
      console.log('Initializing event listeners');
      this.listenTo(app.session, 'onlogout', this.handlePersonaLogout);
      this.listenTo(app.session, 'onlogin', this.handlePersonaLogin);
      this.listenTo(app.session, 'onready', this.handlePersonaReady);
      this.listenTo(app.session, 'change:logged_in', this.handleLoginStateChange);
      this.listenTo(app.pin, 'change', this.handlePinStateChange);
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

    // Deal with the logged-in attribute state change.
    handleLoginStateChange: function(model, value) {
      console.log('logged_in state changed to ' + value);
      if (value === false) {
        console.log('Displaying login view.');
        app.router.showLogin();
      } else {
        // If we're on the wait-to-finish route, show it.
        if (app.router.current().name === 'showWaitToFinish') {
          app.router.showWaitToFinish();
        // Otherwise we're now needing to check the app state
        // and hand-off to the right view.
        } else {
          this.setUpPayment();
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
        return app.router.navigate('spa/locked', {trigger: true});
      } else if (data.pin_was_locked_out === true) {
        console.log('User was-locked out -> was-locked');
        return app.router.navigate('spa/was-locked', {trigger: true});
      } else if (data.pin === true) {
        console.log('User has a pin so -> enter-pin');
        return app.router.navigate('spa/enter-pin', {trigger: true});
      } else if (data.pin === false) {
        console.log('User has no pin so -> create-pin');
        return app.router.navigate('spa/create-pin', {trigger: true});
      }
    },

    setUpPayment: function() {
      var jwt = app.transaction.get('jwt');
      var that = this;
      if (jwt) {
        var req = app.transaction.startTransaction(jwt);
        req.done(function() {
          console.log('Transaction started successfully');
          utils.trackEvent({action: 'start-transaction',
                            label: 'Transaction started successfully'});
          // TODO: Move this into it's own function.
          // TODO: Store that a transaction has started on the client.
          app.pin.fetch().fail(function($xhr, textStatus) {
            if (textStatus === 'timeout') {
              utils.trackEvent({action: 'fetch-state',
                                label: 'Fetching initial state timed-out.'});
              app.error.render({'context': {'errorCode': 'PIN_STATE_TIMEOUT'},
                                ctaCallback: that.setUpPayment});
            } else {
              utils.trackEvent({action: 'fetch-state',
                                label: 'Fecthing initial state error.'});
              app.error.render({'context': {'errorCode': 'PIN_STATE_ERROR'}});
            }
          });
        }).fail(function($xhr, textStatus) {
          console.log($xhr.status);
          console.log(textStatus);
          if (textStatus === 'timeout') {
            utils.trackEvent({action: 'start-transaction',
                              label: 'Transaction start timed-out'});
            app.error.render({'context': {'errorCode': 'START_TRANS_TIMEOUT'},
                              ctaCallback: that.setUpPayment});
          } else {
            utils.trackEvent({action: 'start-transaction',
                              label: 'Transaction failed to start'});
            app.error.render({'context': {'errorCode': 'START_TRANS_FAILURE'}});
          }
        });
      } else {
        utils.trackEvent({action: 'start-transaction',
                          label: 'Invalid or missing JWT'});
        app.error.render({context: {'errorCode': 'INVALID_JWT'}});
      }
    },

  });

  return PageView;
});
