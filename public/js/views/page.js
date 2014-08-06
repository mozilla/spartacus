define([
  'auth',
  'jquery',
  'log',
  'settings',
  'underscore',
  'utils',
  'views/base'
], function(auth, $, log, settings, _, utils, BaseView){

  'use strict';

  var console = log('view', 'page');

  var PageView = BaseView.extend({

    initialize: function() {
      console.log('Page initialize');
      BaseView.prototype.initialize.call(this);
      // Init Model event listeners;
      console.log('Initializing event listeners');
      this.listenTo(app.session, 'onLogout', this.handlePersonaLogout);
      this.listenTo(app.session, 'onLogin', this.handlePersonaLogin);
      this.listenTo(app.session, 'onReady', this.handlePersonaReady);
      this.listenTo(app.session, 'onImpliedLogin', this.handlePersonaImpliedLogin);
      this.listenTo(app.session, 'change:logged_in', this.handleLoginStateChange);
      this.listenTo(app.pin, 'change', this.handlePinStateChange);
    },

    // Persona has told use we should be logged out.
    handlePersonaLogout: function() {
      console.log('Responding to onlogout event');
      // TODO: Nothing is tied to the resetUser success or failure. Is this ok?
      auth.resetUser();
      // This will result in the login screen appearing.
      app.session.set('logged_in', false);
    },

    // Persona has told us we should be logged-in.
    handlePersonaLogin: function(assertion) {
      console.log('Responding to onlogin event');
      auth.verifyUser(assertion);
    },

    handlePersonaReady: function() {
      console.log('handlePersonReady no-op');
    },

    // Browser's state matches loggedInUser so we're probably logged in.
    handlePersonaImpliedLogin: function() {
      console.log('Probably logged in, Persona never called back');
      console.log('Updating app.session: logged_in -> true');
      app.session.set('logged_in', true);
      if (app.session.get('user_hash') === null) {
        // Set user_hash to false so we know it
        // was not set with an assertion.
        console.log('Updating app.session: user_hash -> false');
        app.session.set('user_hash', false);
      }
    },

    // Deal with the logged-in attribute state change.
    handleLoginStateChange: function(model, value) {
      console.log('logged_in state changed to ' + value);
      if (value === false) {
        console.log('Displaying login view.');
        app.router.showLogin();
      } else if (value === true) {
        if (app.startView) {
          // app.startView is set by an data attr data-start-view.
          // if defined we will use that as the starting view instead
          // of assuming the need to set up a Payment.
          // This will be a no-op function if the route doesn't exist.
          try {
            app.router.getMappedRouteFunc(app.startView)();
          } catch(e) {
            if (e instanceof Error && e.message === 'NO_MAPPED_ROUTE') {
              return app.error.render({errorCode: e.message});
            } else {
              throw e;
            }
          }
        } else {
          console.log('Setting up payment');
          // Otherwise we're now needing to setup a payment before
          // checking the app state to hand off to the correct view.
          this.setUpPayment();
        }
      } else {
        utils.trackEvent({action: 'login state change',
                          label: 'Unexpected change value'});
        return app.error.render({errorCode: 'UNEXPECTED_LOGIN_STATE'});
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
      var that = this;
      var jwt = app.transaction.get('jwt');
      if (jwt) {
        var req = app.transaction.startTransaction(jwt);
        var getTransaction = $.Deferred();

        req.done(function(result) {
          console.log('Transaction started successfully; simulation?',
                      result.simulation);
          var action = (result.simulation ? 'start-simulated-transaction':
                        'start-transaction');
          utils.trackEvent({action: action,
                            label: 'Transaction started successfully'});

          var transResult = {simulation: false};
          if (result.simulation) {
            console.log('transaction is a simulation; result:',
                        result.simulation);
            transResult.simulation = result.simulation;
          }
          console.log('Got transaction result');
          getTransaction.resolve(transResult);
        }).fail(function($xhr, textStatus) {
          console.error('XHR status', $xhr.status);
          console.error('response status', textStatus);
          if (textStatus === 'timeout') {
            utils.trackEvent({action: 'start-transaction',
                              label: 'Transaction start timed-out'});
            return app.error.render({errorCode: 'TRANS_TIMEOUT',
                                     ctaCallback: function(){ that.setUpPayment(); }});
          } else {
            utils.trackEvent({action: 'start-transaction',
                              label: 'Transaction failed to start'});
            return app.error.render({errorCode: 'TRANS_CONFIG_FAILED'});
          }
        });

        getTransaction.then(function(result) {
          if (!result.simulation) {
            app.pin.fetch().fail(function($xhr, textStatus) {
              if (textStatus === 'timeout') {
                utils.trackEvent({action: 'fetch-state',
                                  label: 'Fetching initial state timed-out.'});
                return app.error.render({errorCode: 'PIN_STATE_TIMEOUT',
                                         ctaCallback: that.setUpPayment});
              } else {
                utils.trackEvent({action: 'fetch-state',
                                  label: 'Fetching initial state error.'});
                return app.error.render({errorCode: 'PIN_STATE_ERROR'});
              }
            });
          } else {
            app.session.set('simulate_result', result.simulation);
            console.log('navigating to simulation screen');
            app.router.navigate('spa/simulate', {trigger: true});
          }
        });

      } else {
        utils.trackEvent({action: 'start-transaction',
                          label: 'Invalid or missing JWT'});
        return app.error.render({errorCode: 'MISSING_JWT'});
      }
    },
  });

  return PageView;
});
