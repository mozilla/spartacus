define([
  'log',
  'utils',
  'views/page',
  'wait'
], function(log, utils, PageView, wait) {

  'use strict';

  // This view is called on return from the payment provider.
  var CompletePaymentView = PageView.extend({

    provider: null,

    initialize: function(options) {
      options = options || {};
      var params = options.params || {};
      PageView.prototype.initialize.call(this);
      this.provider = params.provider;
    },

    pollForCompletion: function() {
      var statusCompleted = utils.bodyData.transStatusCompleted;
      if (typeof statusCompleted !== 'undefined') {
        wait.startWaiting(statusCompleted);
      } else {
        return app.error.render({errorCode: 'STATUS_COMPLETE_UNDEF'});
      }
    },

    render: function(){
      app.throbber.render(this.gettext('Completing payment'));
      if (this.provider === 'boku') {
        this.pollForCompletion();
      } else {
        utils.mozPaymentProvider.paymentSuccess();
      }
      return this;
    }

  });

  return CompletePaymentView;
});
