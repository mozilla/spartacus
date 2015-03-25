define([
  'log',
  'utils',
  'views/page',
], function(log, utils, PageView) {

  'use strict';

  var logger = log('views', 'payment-success');

  // This view is called on return from the payment provider.
  var PaymentSuccessView = PageView.extend({

    render: function(){
      app.throbber.render(this.gettext('Completing payment'));
      utils.trackEvent({'action': 'payment-success',
                        'label': 'Payment Complete'});
      logger.log('Completing payment');
      utils.mozPaymentProvider.paymentSuccess();
      return this;
    }

  });

  return PaymentSuccessView;
});
