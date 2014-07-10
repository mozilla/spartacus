define([
  'log',
  'utils',
  'views/page',
], function(log, utils, PageView) {

  'use strict';

  var console = log('view', 'complete-payment');

  // This view is called on return from the payment provider.
  var PaymentSuccessView = PageView.extend({

    render: function(){
      app.throbber.render(this.gettext('Completing payment'));
      console.log('Completing payment');
      utils.mozPaymentProvider.paymentSuccess();
      return this;
    }

  });

  return PaymentSuccessView;
});
