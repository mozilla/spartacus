define([
  'auth',
  'log',
  'views/page'
], function(auth, log, PageView){

  'use strict';

  var console = log('view', 'fxa-login');
  var FxAAuthView = PageView.extend({

    render: function(){
      console.log('authorizing FxA login');
      auth.startFxA(false);
      return;
    }
  });

  return FxAAuthView;
});

