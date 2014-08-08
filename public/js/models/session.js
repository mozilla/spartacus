define([
  'backbone',
  'cancel',
  'i18n',
  'jquery',
  'log',
  'utils'
], function(Backbone, cancel, i18n, $, log, utils){

  var console = log('model', 'session');

  var SessionModel = Backbone.Model.extend({

    calledBack: false,

    defaults: {
      logged_in: null,
      user_hash: null,
      simulate_result: null
    },

    initialize: function() {
      console.log('session model inited');
    },

    getRequestConfig: function(options) {
      var defaults = {
        experimental_allowUnverified: true,
        experimental_forceIssuer: utils.bodyData.unverifiedIssuer,
        experimental_emailHint: utils.bodyData.loggedInUser,
        privacyPolicy: utils.bodyData.privacyPolicy,
        termsOfService: utils.bodyData.termsOfService,
        oncancel: function() {
          utils.trackwebpayevent({'action': 'persona login',
                                  'label': 'cancelled'});
          cancel.callPayFailure();
        }
      };
      var docLangs = ['cs', 'de', 'el', 'en-US', 'es', 'hr', 'hu', 'it', 'pl', 'pt-BR', 'sr', 'zh-CN'];

      var lang = i18n.getLangFromLangAttr();
      var docLang = docLangs.indexOf(lang) >= 0 ? lang : 'en-US';
      var docLocation = utils.bodyData.staticDocsUrl + 'media/docs/{type}/' + docLang + '.html?20131014-4';
      defaults.termsOfService = utils.format(docLocation, {type: 'terms'});
      defaults.privacyPolicy = utils.format(docLocation, {type: 'privacy'});
      if (utils.supportsNativeFxA()) {
        // On Firefox OS 2.0 and later, request Firefox Accounts login.
        defaults.wantIssuer = 'firefox-accounts';
      }
      return $.extend({}, defaults, options || {});
    },

    login: function(options) {
      this.calledBack = false;
      var config = this.getRequestConfig(options);
      console.log('Running navigator.id.request');
      navigator.id.request(config);
    },

    watchIdentity: function(options) {
      var that = this;
      this.calledBack = false;
      var user = utils.bodyData.loggedInUser;
      console.log('loggedInUser', typeof user, user);

      var defaults = {
        loggedInUser: user || undefined,
        onlogin: function(assertion){
          that.calledBack = true;
          console.log('Firing onlogin event');
          that.trigger('onLogin', assertion);
        },
        onlogout: function() {
          that.calledBack = true;
          console.log('Firing onlogout event');
          that.trigger('onLogout');
        },
        onready: function() {
          console.log('Firing onready event');
          that.trigger('onReady');
          if (that.calledBack === false && utils.bodyData.loggedInUser) {
            console.log('Firing onImpliedLogin event');
            that.trigger('onImpliedLogin');
          }
        }
      };

      var params = $.extend({}, defaults, options || {});
      console.log('Running navigator.id.watch');
      navigator.id.watch(params);
    },

  });

  return SessionModel;
});
