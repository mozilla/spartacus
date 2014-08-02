define([
  'cancel',
  'i18n',
  'jquery',
  'log',
  'utils'
], function(cancel, i18n, $, log,  utils) {

  'use strict';

  return {

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

    request: function(options) {
      var console = log('id', 'request');
      var config = this.getRequestConfig(options);
      console.log('Running navigator.id.request');
      navigator.id.request(config);
    },

    watch: function(options) {
      var console = log('id', 'watch');
      var user = utils.bodyData.loggedInUser;
      console.log('loggedInUser', typeof user, user);
      var defaults = {
        // When we get a falsey user, set an undefined state
        // which will trigger onlogout(),
        // see https://developer.mozilla.org/en-US/docs/DOM/navigator.id.watch
        loggedInUser: user || undefined,
      };
      var params = $.extend({}, defaults, options || {});
      console.log('Running navigator.id.watch');
      navigator.id.watch(params);
    }
  };
});
