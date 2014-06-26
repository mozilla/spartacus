define([
  'utils',
  'views/page',
  'query-string'
], function(utils, PageView){

  'use strict';

  var InitView = PageView.extend({

    render: function() {
      app.initialRoute = app.router.current();
      app.throbber.render(this.gettext('Initializing'));
      if (!app.transaction.get('jwt') && app.initialRoute.name !== 'showWaitToFinish') {
        this.extractJWT();
      }
      app.session.watchIdentity();
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
        app.error.render({context: {'errorCode': 'INVALID_JWT'}});
      }
    }

  });

  return InitView;

});
