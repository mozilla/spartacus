define([
  'log',
  'utils',
  'views/page',
], function(log, utils, PageView) {

  'use strict';

  var logger = log('views', 'payment-failed');

  // This view is called on return from the payment provider.
  var PaymentFailedView = PageView.extend({

    render: function(){
      var errorCode = utils.bodyData.errorCode || 'MISSING_ERROR_CODE';
      logger.log('Showing error for payment failure: ' + errorCode);
      return app.error.render({errorCode: errorCode});
    }

  });

  return PaymentFailedView;
});
