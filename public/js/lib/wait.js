define([
  'i18n',
  'jquery',
  'log',
  'settings',
  'utils'
], function(i18n, $, log, settings, utils) {

  "use strict";

  var console = log('wait');
  var gettext = i18n.gettext;
  var pollTimeout;
  var request;
  var startUrl = utils.bodyData.transStartUrl;
  var transactionTimeout;


  function clearPoll() {
    if (pollTimeout) {
      console.log('Clearing poll timer.');
      window.clearTimeout(pollTimeout);
      pollTimeout = null;
    }
  }

  function clearTransactionTimeout() {
    if (transactionTimeout) {
      console.log('Clearing global transaction timer.');
      window.clearTimeout(transactionTimeout);
      transactionTimeout = null;
    }
  }

  function startGlobalTimer() {
    console.log('Starting global transaction timer.');
    clearTransactionTimeout();
    transactionTimeout = window.setTimeout(function() {
      if (request) {
        request.abort();
      }
      clearPoll();
      // needed to reset transactionTimeout var.
      clearTransactionTimeout();
      console.log('transaction failed to be found.');
      utils.trackEvent({'action': 'payment',
                        'label': 'Transaction Failed to be found'});
      app.throbber.close();
      return app.error.render({errorCode: 'TRANS_NOT_FOUND'});
    }, settings.wait_timeout);
  }

  function startWaiting(expectedStatus) {
    app.error.close();
    app.throbber.render(gettext('Retrieving Transaction'));
    startGlobalTimer();
    poll(expectedStatus);
    utils.trackEvent({'action': 'payment',
                      'label': 'Start waiting for provider'});
  }

  function poll(expectedStatus) {
    console.log('[wait] polling ' + startUrl + ' until status ' + expectedStatus);

    function clear() {
      clearPoll();
      clearTransactionTimeout();
    }

    if (!startUrl) {
      return app.error.render({errorCode: 'WAIT_URL_NOT_SET'});
    }

    request = $.ajax({
      type: 'GET',
      url: startUrl,
    });

    request.done(function(data) {
      function trackClosePayFlow() {
        utils.trackEvent({'action': 'payment',
                          'label': 'Closing Pay Flow'});
      }

      if (data.status === expectedStatus) {
        // This wait screen can be used in different contexts.
        // If we are finishing or beginning the pay flow,
        // redirect to the destination URL.
        clear();
        if (data.url) {
          utils.trackEvent({'action': 'payment',
                            'label': 'Redirect To Pay Flow'});
          console.log('transaction found; redirect to ' + data.url);
          window.location = data.url;
        } else {
          console.log('transaction completed; closing pay flow');
          trackClosePayFlow();
          utils.mozPaymentProvider.paymentSuccess();
        }
      } else if (data.status === utils.bodyData.transStatusFailed) {
        clear();
        app.throbber.close();
        console.log('transaction failed');
        return app.error.render({errorCode: 'TRANS_FAILED'});

      } else if (data.status === utils.bodyData.transStatusCancelled) {
        clear();
        console.log('[wait] payment cancelled by user; closing pay flow');
        trackClosePayFlow();
        // This string is used to determine the message on Marketplace;
        // change it at your peril.
        utils.mozPaymentProvider.paymentFailed('USER_CANCELLED');
      } else {
        // The transaction is in some kind of incomplete state.
        console.log('[wait] transaction status: ' + data.status +'; expecting: ' + expectedStatus);
        pollTimeout = window.setTimeout(function() {
          poll(expectedStatus);
        }, settings.poll_interval);
      }
    });

    request.fail(function($xhr, textStatus) {

      if (textStatus === 'timeout') {
        clear();
        console.log('transaction request timed out');
        utils.trackEvent({'action': 'payment',
                          'label': 'Transaction Request Timed Out'});
        app.throbber.close();
        return app.error.render({
          ctaText: gettext('Retry?'),
          errorCode: 'TRANS_TIMEOUT',
          ctaCallback: function(e){
            e.preventDefault();
            startWaiting(expectedStatus);
          }
        });

      } else {
        console.log('error checking transaction');
        utils.trackEvent({'action': 'payment',
                          'label': 'Error Checking Transaction'});
        pollTimeout = window.setTimeout(function() {
          poll(expectedStatus);
        }, settings.poll_interval);
      }
    });
  }

  return {
    startWaiting: startWaiting
  };

});
