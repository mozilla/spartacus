define([
  'utils',
  'views/page',
  'query-string'
], function(utils, PageView){

  'use strict';

  var InitView = PageView.extend({

    render: function() {
      if (window.location.pathname === "/mozpay/spa/fxa-auth") {
        // Not a 'real' page view, skip all the usual stuff.
        app.router.finishFxALogin();
        return;
      }
      app.throbber.render(this.gettext('Initializing'));
      this.extractJWT();
      if (utils.bodyData.fxaUrl) {
        console.log("FxA enabled, checking login");
        if (!app.session.get('logged_in')) {
          console.log("showing FxA login");
          app.router.showLogin();
        }
      } else {
        app.session.watchIdentity();
      }
    },

    extractJWT: function() {
      console.log('Checking for JWT');
      var qs = window.queryString.parse(location.search) || {};
      var jwt = qs.req;
      if (jwt) {
        console.log('Setting JWT on transaction model');
        app.transaction.set('jwt', jwt);
      }
    }
  });

  return InitView;

});
