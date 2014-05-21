define([
  'i18n-abide-utils',
  'log'
], function(i18n, log) {

  'use strict';

  var console = log('cancel');

  var pollPaymentFailed = function pollPaymentFailed() {
    // Bug 872987 introduced the injection of the "paymentSuccess" and
    // "paymentFailed" functions within a "mozPaymentProvider" object
    // instead of injecting them in the global scope. So we need to support
    // both APIs.
    var mozPayProvider = window.mozPaymentProvider || {};
    var paymentFailed = mozPayProvider.paymentFailed || window.paymentFailed;

    // After Bug 843309 landed, there should not be any delay before the
    // mozPaymentProvider API is injected into scope, but we keep the
    // polling loop as a safe guard.
    if (typeof paymentFailed === 'undefined') {
      console.log('waiting for paymentFailed to appear in scope');
      window.setTimeout(pollPaymentFailed, 500);
    } else {
      console.log('payment failed, closing window');
      paymentFailed('USER_CANCELLED');
    }
  };


  function callPayFailure() {
    app.error.clear();
    app.throbber.render(i18n.gettext('Payment Cancelled'));
    pollPaymentFailed();
  }

  return {
    callPayFailure: callPayFailure
  };

});
