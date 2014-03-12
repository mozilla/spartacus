/*
* Thin wrapper around navigator.id for shared code.
*/
define(['jquery', 'log', 'utils'], function($, log,  utils) {

  'use strict';

  return {
    request: function _request(options) {
      var console = log('id', 'request');
      /*jshint camelcase: false */
      var defaults = {
        experimental_allowUnverified: true,
        experimental_forceIssuer: utils.bodyData.unverifiedIssuer,
        experimental_emailHint: utils.bodyData.loggedInUser,
        privacyPolicy: utils.bodyData.privacyPolicy,
        termsOfService: utils.bodyData.termsOfService
      };

      // TODO: Add localised terms/privacy policy here.

      options = $.extend({}, defaults, options || {});
      console.log('Running navigator.id.request');
      navigator.id.request(options);
    },
    watch: function _watch(options) {
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
