define([
  'backbone',
  'cancel',
  'i18n',
  'jquery',
  'log',
  'utils'
], function(Backbone, cancel, i18n, $, log, utils){

  var logger = log('models', 'session');

  var SessionModel = Backbone.Model.extend({

    calledBack: false,

    defaults: {
      logged_in_user: utils.bodyData.loggedInUser,
      logged_in: null,
      user_hash: null,
      simulate_result: null
    },

    initialize: function() {
      logger.log('session model inited');
    },

    runWatch: function(params) {
      navigator.mozId.watch(params);
    },

    getRequestConfig: function(options) {
      options = options || {};
      var defaults = {
        experimental_allowUnverified: true,
        experimental_forceIssuer: utils.bodyData.unverifiedIssuer,
        experimental_emailHint: this.get('logged_in_user'),
        privacyPolicy: utils.bodyData.privacyPolicy,
        termsOfService: utils.bodyData.termsOfService,
        oncancel: function() {
          utils.trackEvent({'action': 'persona login',
                            'label': 'cancelled'});
          cancel.callPayFailure();
        }
      };

      defaults.termsOfService = utils.getTermsLink();
      defaults.privacyPolicy = utils.getPrivacyLink();

      // Persona calls it 'experimental_forceAuthentication', FxA calls it
      // 'refreshAuthentication'.
      if (utils.supportsNativeFxA() && options.experimental_forceAuthentication) {
        // See https://developer.mozilla.org/en-US/docs/Firefox-Accounts-on-FirefoxOS
        options.refreshAuthentication = 0;
      }
      return $.extend({}, defaults, options);
    },

    login: function(options) {
      this.calledBack = false;
      var config = this.getRequestConfig(options);
      logger.log('Running navigator.mozId.request');
      navigator.mozId.request(config);
    },

    watchIdentity: function(options) {
      var that = this;
      this.calledBack = false;
      var user = this.get('logged_in_user');
      logger.log('loggedInUser', typeof user, user);

      var defaults = {
        wantIssuer: 'firefox-accounts',
        loggedInUser: user || undefined,
        onlogin: function(assertion){
          that.calledBack = true;
          logger.log('Firing onLogin');
          that.trigger('onLogin', assertion);
        },
        onlogout: function() {
          that.calledBack = true;
          logger.log('Firing onLogout');
          that.trigger('onLogout');
          // Unset the loggedInUser hint.
          that.set('logged_in_user', '');
        },
        onready: function() {
          logger.log('Firing onReady');
          that.trigger('onReady');
          if (that.calledBack === false && user) {
            logger.log('Firing onImpliedLogin');
            that.trigger('onImpliedLogin');
          } else if (that.calledBack === false) {
            // Run logout if loggedInUser is not set
            // and only `onready` was called by Persona.
            logger.log('Firing implied onLogout');
            that.trigger('onLogout');
          }
        }
      };
      var params = $.extend({}, defaults, options || {});
      logger.log('Running navigator.mozId.watch');
      this.runWatch(params);
    },

  });

  return SessionModel;
});
