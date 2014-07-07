define([
  'log',
  'settings',
  'utils',
  'views/page',
  'wait'
], function(log, settings, utils, PageView, wait) {

  'use strict';

  // This view is called on return from the payment provider.
  var PaymentCompleteView = PageView.extend({

    provider: null,

    initialize: function(options) {
      PageView.prototype.initialize.call(this);
      options = options || {};
      var params = options.params || {};
      this.provider = params.provider;
    },

    pollForCompletion: function() {
      var statusCompleted = utils.bodyData.transStatusCompleted;
      if (typeof statusCompleted !== 'undefined') {
        utils.trackEvent({'action': 'Complete Payment',
                          'label': 'Starting to Poll For Transaction'});
        wait.startWaiting(statusCompleted);
      } else {
        utils.trackEvent({'action': 'Complete Payment',
                          'label': 'Complete Status Data Attr Missing'});
        return app.error.render({errorCode: 'STATUS_COMPLETE_UNDEF'});
      }
    },

    render: function(){
      app.throbber.render(this.gettext('Completing payment'));
      if (this.provider === 'boku') {
        console.log('Starting to poll for completion');
        this.pollForCompletion();
      } else if (settings.validProviders.indexOf(this.provider) > -1) {
        console.log('Calling paymentSuccess');
        utils.trackEvent({'action': 'Complete Payment',
                          'label': 'Calling paymentSuccess'});
        utils.mozPaymentProvider.paymentSuccess();
      } else {
        utils.trackEvent({'action': 'Complete Payment',
                          'label': 'Invalid Provider'});
        return app.error.render({errorCode: 'INVALID_PROVIDER'});
      }
      return this;
    }

  });

  return PaymentCompleteView;
});
