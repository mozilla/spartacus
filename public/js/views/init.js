define([
  'log',
  'utils',
  'views/page',
  'query-string'
], function(log, utils, PageView){

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
        if (!app.session.get('logged_in_user')) {
          utils.fxaLogin();
        } else {
          if (utils.bodyData.mktUser === false && utils.bodyData.startView === 'index') {
            // A user is already logged-in but we want to provide
            // the option to logout if required but only on the index page.
            logger.log('Show logged-in-state view');
            app.router.showLoggedInState();
            return;
          } else {
            logger.log('Implied login for FxA');
            app.session.set('logged_in', true);
          }
        }
      } else {
        app.session.watchIdentity();
      }
    },

    extractJWT: function() {
      logger.log('Checking for JWT');
      var qs = window.queryString.parse(location.search) || {};
      var jwt = qs.req;
      if (jwt) {
        logger.log('Setting JWT on transaction model');
        app.transaction.set('jwt', jwt);
      }
    }
  });

  return InitView;

});
