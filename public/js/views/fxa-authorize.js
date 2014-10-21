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
      var reverify = sessionStorage.getItem('fxa-reverification') === 'true';
      auth.startFxA(reverify);
      return;
    }
  });

  return FxAAuthView;
});

