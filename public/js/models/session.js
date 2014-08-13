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
      logged_in_user: utils.bodyData.loggedInUser,
      logged_in: null,
      user_hash: null,
      simulate_result: null
    },

    initialize: function() {
      console.log('session model inited');
    },

    runWatch: function(params) {
      navigator.id.watch(params);
    },

    getRequestConfig: function(options) {
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
      var docLangs = ['cs', 'de', 'el', 'en-US', 'es', 'hr', 'hu', 'it', 'pl', 'pt-BR', 'sr', 'zh-CN'];

      var lang = i18n.getLangFromLangAttr();
      var docLang = docLangs.indexOf(lang) >= 0 ? lang : 'en-US';
      var docLocation = utils.bodyData.staticDocsUrl + 'media/docs/{type}/' + docLang + '.html?20131014-4';
      defaults.termsOfService = utils.format(docLocation, {type: 'terms'});
      defaults.privacyPolicy = utils.format(docLocation, {type: 'privacy'});
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
      var user = this.get('logged_in_user');
      console.log('loggedInUser', typeof user, user);

      var defaults = {
        loggedInUser: user || undefined,
        onlogin: function(assertion){
          that.calledBack = true;
          console.log('Firing onLogin');
          that.trigger('onLogin', assertion);
        },
        onlogout: function() {
          that.calledBack = true;
          console.log('Firing onLogout');
          that.trigger('onLogout');
          // Unset the loggedInUser hint.
          that.set('logged_in_user', '');
        },
        onready: function() {
          console.log('Firing onReady');
          that.trigger('onReady');
          if (that.calledBack === false && user) {
            console.log('Firing onImpliedLogin');
            that.trigger('onImpliedLogin');
          } else if (that.calledBack === false) {
            // Run logout if loggedInUser is not set
            // and only `onready` was called by Persona.
            console.log('Firing implied onLogout');
            that.trigger('onLogout');
          }
        }
      };
      var params = $.extend({}, defaults, options || {});

      if (utils.supportsNativeFxA()) {
        // On Firefox OS 2.0 and later, request Firefox Accounts login.
        defaults.wantIssuer = 'firefox-accounts';
      }
      console.log('Running navigator.id.watch');
      this.runWatch(params);
    },

  });

  return SessionModel;
});
