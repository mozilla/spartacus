define([
  'i18n-abide-utils',
  'log',
  'utils'
], function(i18n, log, utils) {

  'use strict';

  var console = log('cancel');

  function callPayFailure(e, errorCode) {
    if (e) {
      e.preventDefault();
    }
    app.error.close();
    app.throbber.render(i18n.gettext('Payment cancelled.'));
    errorCode = errorCode || 'USER_CANCELLED';
    console.log('Running paymentFailed with errorCode: ' + errorCode);
    utils.mozPaymentProvider.paymentFailed(errorCode);
  }

  return {
    callPayFailure: callPayFailure
  };

});
