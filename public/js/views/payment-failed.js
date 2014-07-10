define([
  'log',
  'utils',
  'views/page',
], function(log, utils, PageView) {

  'use strict';

  var console = log('view', 'payment-failed');

  // This view is called on return from the payment provider.
  var PaymentFailedView = PageView.extend({

    render: function(){
      console.log('Showing error for payment failure');
      var errorCode = utils.bodyData.errorCode || 'MISSING_ERROR_CODE';
      return app.error.render({errorCode: errorCode});
    }

  });

  return PaymentFailedView;
});
