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

  var logger = log('views', 'page');

  var PageView = BaseView.extend({

    initialize: function() {
      logger.log('Page initialize');
      BaseView.prototype.initialize.call(this);
      // Init Model event listeners;
      logger.log('Initializing event listeners');
      this.listenTo(app.session, 'onLogout', this.handlePersonaLogout);
      this.listenTo(app.session, 'onLogin', this.handlePersonaLogin);
      this.listenTo(app.session, 'onReady', this.handlePersonaReady);
      this.listenTo(app.session, 'onImpliedLogin', this.handlePersonaImpliedLogin);
      this.listenTo(app.session, 'change:logged_in', this.handleLoginStateChange);
      this.listenTo(app.pin, 'change', this.handlePinStateChange);
    },

    // Persona has told use we should be logged out.
    handlePersonaLogout: function() {
      var that = this;
      logger.log('Responding to onlogout event');
      app.throbber.render(this.gettext('Logging out'));
      auth.resetUser().done(function() {
        // This will result in the login screen appearing.
        app.session.set('logged_in', false);
      }).fail(function() {
        app.throbber.close();
        app.error.render({
          heading: that.gettext('Oops'),
          errorCode: 'LOGOUT_FAILED',
          ctaText: that.gettext('Retry?'),
          ctaCallback: function(e){
            e.preventDefault();
            app.error.close();
            that.handlePersonaLogout();
          }
        });
      });
    },

    // Persona has told us we should be logged-in.
    handlePersonaLogin: function(assertion) {
      logger.log('Responding to onlogin event');
      auth.verifyUser(assertion);
    },

    handlePersonaReady: function() {
      logger.log('handlePersonReady no-op');
    },

    // Browser's state matches loggedInUser so we're probably logged in.
    handlePersonaImpliedLogin: function() {
      logger.log('Probably logged in, Persona never called back');
      logger.log('Updating app.session: logged_in -> true');
      app.session.set('logged_in', true);
      if (app.session.get('user_hash') === null) {
        // Set user_hash to false so we know it
        // was not set with an assertion.
        logger.log('Updating app.session: user_hash -> false');
        app.session.set('user_hash', false);
      }
    },

    // Deal with the logged-in attribute state change.
    handleLoginStateChange: function(model, value) {
      logger.log('logged_in state changed to ' + value);
      if (value === false) {
        if (utils.useOAuthFxA()) {
          // FxA
          utils.fxaLogin();
        } else {
          // Persona
          logger.log('Displaying login view.');
          app.router.showLogin();
        }
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
          logger.log('Setting up payment');
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
      logger.log('Checking changed pin state data');
      var data = model.changed;
      if (data.pin_is_locked_out === true) {
        logger.log('User is locked out -> locked');
        return app.router.showLocked();
      } else if (data.pin_was_locked_out === true) {
        logger.log('User was-locked out -> was-locked');
        return app.router.showWasLocked();
      } else if (data.pin === true) {
        logger.log('User has a pin so -> enter-pin');
        return app.router.showEnterPin();
      } else if (data.pin === false) {
        logger.log('User has no pin so -> create-pin');
        return app.router.showCreatePin();
      }
    },


    getState: function() {
      var that = this;
      app.pin.fetch().fail(function($xhr, textStatus) {
        if (textStatus === 'timeout') {
          utils.trackEvent({action: 'fetch-state',
                            label: 'Fetching initial state timed-out.'});
          return app.error.render({errorCode: 'PIN_STATE_TIMEOUT',
                                   ctaCallback: function() { that.setUpPayment(); } });
        } else {
          utils.trackEvent({action: 'fetch-state',
                            label: 'Fetching initial state error.'});
          return app.error.render({errorCode: 'PIN_STATE_ERROR'});
        }
      });
    },

    setUpPayment: function() {
      var that = this;

      if (app.transaction.jwt()) {
        var req = app.transaction.startTransaction();
        var getTransaction = $.Deferred();

        req.done(function(result) {
          logger.log('Transaction started successfully; simulation?',
                      result.simulation);
          var action = (result.simulation ? 'start-simulated-transaction':
                        'start-transaction');
          utils.trackEvent({action: action,
                            label: 'Transaction started successfully'});

          var transResult = {simulation: false};
          if (result.simulation) {
            logger.log('transaction is a simulation; result:',
                        result.simulation);
            transResult.simulation = result.simulation;
          }
          logger.log('Got transaction result');
          getTransaction.resolve(transResult);
        }).fail(function($xhr, textStatus) {
          logger.error('XHR status', $xhr.status);
          logger.error('response status', textStatus);
          if (textStatus === 'timeout') {
            utils.trackEvent({action: 'start-transaction',
                              label: 'Transaction start timed-out'});
            return app.error.render({errorCode: 'TRANS_TIMEOUT',
                                     ctaCallback: function(){ that.setUpPayment(); }});
          } else {
            utils.trackEvent({action: 'start-transaction',
                              label: 'Transaction failed to start'});
            return app.error.render(
              {errorCode: utils.errorCodeFromXhr($xhr, 'TRANS_REQUEST_FAILED')});
          }
        });

        getTransaction.then(function(result) {
          if (!result.simulation) {
            that.getState();
          } else {
            app.session.set('simulate_result', result.simulation);
            logger.log('navigating to simulation screen');
            app.router.showSimulate();
          }
        });

      } else {
        this.getState();
      }
    },
  });

  return PageView;
});
