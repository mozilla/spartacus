define([
  'error-codes',
  'log',
  'settings',
  'utils',
  'views/page',
], function(errorCodes, log, settings, utils, PageView) {

  'use strict';

  // This view is called on return from the payment provider.
  var PaymentFailedView = PageView.extend({

    provider: null,

    initialize: function(options) {
      PageView.prototype.initialize.call(this);
      options = options || {};
      var params = options.params || {};
      this.provider = params.provider;
      this.error = params.error;
    },

    render: function(){
      var heading = this.gettext('Payment Failed');

      // Boku is not expected to use this route.
      if (settings.validProviders.indexOf(this.provider) > -1) {
        var error = this.error;
        if (error && Object.keys(errorCodes).indexOf(error) > -1) {
          return app.error.render({heading: heading,
                                   errorCode: error});
        } else {
          utils.trackEvent({'action': 'Payment Failure',
                            'label': 'Unexpected Error Code'});
          return app.error.render({heading: heading,
                                   errorCode: 'UNEXPECTED_ERROR_CODE'});
        }
      } else {
        utils.trackEvent({'action': 'Payment Failure',
                          'label': 'Invalid Provider'});
        return app.error.render({heading: heading,
                                 errorCode: 'INVALID_PROVIDER'});
      }
      return this;
    }

  });

  return PaymentFailedView;
});
