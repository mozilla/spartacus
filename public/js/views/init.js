define([
  'utils',
  'views/page',
  'query-string'
], function(utils, PageView){

  'use strict';

  var InitView = PageView.extend({

    render: function() {
      app.throbber.render(this.gettext('Initializing'));
      if (!app.transaction.get('jwt') && !app.startView) {
        this.extractJWT();
      }
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
      console.log('Extracting JWT');
      var qs = window.queryString.parse(location.search) || {};
      var jwt = qs.req;
      if (jwt) {
        console.log('setting jwt on transaction model');
        app.transaction.set('jwt', jwt);
      } else {
        utils.trackEvent({action: 'extract jwt before login',
                          label: 'Invalid or missing JWT'});
        return app.error.render({'errorCode': 'MISSING_JWT'});
      }
    }

  });

  return InitView;

});
