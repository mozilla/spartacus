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
      auth.startFxA(false);
      return;
    }
  });

  return FxAAuthView;
});

