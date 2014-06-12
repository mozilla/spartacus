define([
  'i18n',
  'jquery',
  'log',
  'settings',
  'utils'
], function(i18n, $, log, settings, utils) {

  "use strict";

  var startUrl;
  var pollTimeout;
  var transactionTimeout;
  var request;
  var gettext = i18n.gettext;

  var console = log('wait');

  function clearPoll() {
    if (pollTimeout) {
      console.log('Clearing poll timer.');
      window.clearTimeout(pollTimeout);
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
      app.error.render({
        context: {
          errorCode: 'TRANS_NOT_FOUND'
        },
      });
    }, settings.wait_timeout);
  }

  function startWaiting(expectedStatus) {
    app.error.close();
    app.throbber.render(gettext('Retrieving Transaction'));
    startUrl = utils.bodyData.transStartUrl;
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
      app.error.render({
        context: {
          errorCode: 'WAIT_URL_NOT_SET',
          msg: gettext('No wait URL has been set. Aborting.')
        },
      });
      return;
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

      var paymentSuccess = (utils.mozPaymentProvider.paymentSuccess ||
                            window.paymentSuccess);
      var paymentFailed = (utils.mozPaymentProvider.paymentFailed ||
                           window.paymentFailed);

      if (data.status === expectedStatus) {
        // This wait screen can be used in different contexts.
        // If we are finishing or beginning the pay flow,
        // redirect to the destination URL.
        clear();
        if (data.url) {
          utils.trackEvent({'action': 'payment',
                            'label': 'Redirect To Pay Flow'});
          console.log('transaction completed; redirect to ' + data.url);
          window.location = data.url;
        } else {
          console.log('transaction completed; closing pay flow');
          trackClosePayFlow();
          if (paymentSuccess) {
            paymentSuccess();
          } else {
            console.log('No paymentSuccess function');
            app.error.render({
              context: {
                errorCode: 'NO_PAY_SUCCESS_FUNC',
                msg: gettext('This looks to have completed successfully but you have no native paymentSuccess func.')
              },
            });
          }
        }
      } else if (data.status === utils.bodyData.transStatusFailed) {
        clear();
        app.throbber.close();
        console.log('transaction failed');
        app.error.render({
          context: {
            errorCode: 'TRANS_FAILED',
            msg: gettext('The transaction failed. You have not been charged for this purchase.')
          },
        });

      } else if (data.status === utils.bodyData.transStatusCancelled) {
        clear();
        console.log('[wait] payment cancelled by user; closing pay flow');
        trackClosePayFlow();
        // This string is used to determine the message on Marketplace;
        // change it at your peril.
        if (paymentFailed) {
          paymentFailed('USER_CANCELLED');
        } else {
          app.error.render({
            context: {
              errorCode: 'NO_PAY_FAILED_FUNC',
              msg: gettext("This transaction has been cancelled. No paymentFailed function exists so can't call it,")
            },
          });
        }

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
        app.error.render({
          context: {
            ctaText: gettext('Retry?'),
            errorCode: 'TRANS_TIMEOUT'
          },
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
