define([
  'log',
  'utils',
  'auth',
  'views/page',
  'query-string'
], function(log, utils, auth, PageView){

  'use strict';

  var logger = log('views', 'init');
  var InitView = PageView.extend({

    render: function() {
      if (window.location.pathname === "/mozpay/spa/fxa-auth") {
        // Not a 'real' page view, skip all the usual stuff.
        app.router.finishFxALogin();
        return;
      }
      this.extractJWT();
      if (utils.useOAuthFxA()) {
        logger.log("FxA enabled, checking login");
        if (!app.session.get('logged_in')) {
          logger.log("showing FxA login");
          app.router.showLogin();
        }
      } else {
        app.session.watchIdentity();
      }
    },

    extractJWT: function() {
      logger.log('Checking for JWT');
      var qs = window.queryString.parse(location.search) || {};
      if (qs.req) {
        if  (qs.req.contains('|')) {
          var parts = qs.req.split('|', 1);
          var usertoken = parts[0];
          var jwt = parts[1];
        } else {
          var jwt = qs.req;
        }
        if (usertoken) {
          logger.log("Verifying Fireplace shared-secret auth token:" + usertoken);
          utils.verifySharedSecret(usertoken);
        }
        logger.log('Setting JWT on transaction model');
        app.transaction.set('jwt', jwt);
      }
    }
  });

  return InitView;

});
