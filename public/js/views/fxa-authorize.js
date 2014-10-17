define([
  'auth',
  'log',
  'views/page'
], function(auth, log, PageView){

  'use strict';

  var logger = log('views', 'fxa-authorize');
  var FxAAuthView = PageView.extend({

    render: function(){
      logger.log('authorizing FxA login');
      this.extractJWT();
      auth.startFxA(false);
      return;
    },

    extractJWT: function() {
      try {
        var jwt = localStorage.getItem('spa-jwt');
        if (jwt) {
          logger.log('Setting JWT on transaction model from localStorage');
          app.transaction.set('jwt', jwt);
          localStorage.removeItem('spa-jwt');
        }
      } catch (e) {
        logger.error('Cannot retrieve JWT from localStorage');
      }
    }
  });

  return FxAAuthView;
});

