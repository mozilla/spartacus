define([
  'i18n',
  'jquery',
  'log',
  'provider',
  'settings',
  'utils'
], function(i18n, $, log, provider, settings, utils) {

  "use strict";

  var logger = log('lib', 'wait');
  var gettext = i18n.gettext;
  var pollTimeout;
  var request;
  var startUrl = utils.bodyData.transStartUrl;
  var transactionTimeout;


  function clearPoll() {
    if (pollTimeout) {
      logger.log('Clearing poll timer.');
      window.clearTimeout(pollTimeout);
      pollTimeout = null;
    }
  }

  function clearTransactionTimeout() {
    if (transactionTimeout) {
      logger.log('Clearing global transaction timer.');
      window.clearTimeout(transactionTimeout);
      transactionTimeout = null;
    }
  }

  function startGlobalTimer() {
    logger.log('Starting global transaction timer.');
    clearTransactionTimeout();
    transactionTimeout = window.setTimeout(function() {
      if (request) {
        request.abort();
      }
      clearPoll();
      // needed to reset transactionTimeout var.
      clearTransactionTimeout();
      logger.log('transaction failed to be found.');
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
    logger.log('polling ' + startUrl + ' until status ' + expectedStatus);

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
          if (utils.isValidRedirURL(data.url)) {
            utils.trackEvent({'action': 'payment',
                              'label': 'Redirect To Pay Flow'});

            logger.log('about to prepare provider', data.provider);
            if (!data.provider) {
              logger.error('The API response returned a falsey provider:',
                            data.provider);
              return app.error.render({errorCode: 'MISSING_PROVIDER'});
            }
            var preparation;
            var Provider = provider.providerFactory(data.provider);
            var userHash = app.session.get('user_hash');

            if (userHash === false) {
              // userHash was set by onready callback (no assertion) - the default is null.
              preparation = Provider.prepareSim();
            } else if (userHash) {
              // If it's set use prepareAll.
              preparation = Provider.prepareAll(app.session.get('user_hash'));
            } else {
              // Othewise all bets are off and this is unexpected.
              return app.error.render({errorCode: 'USER_HASH_UNSET'});
            }

            preparation.done(function() {
              logger.log('Successfully prepared payment provider', data.provider);
              logger.log('transaction completed; redirect to ' + data.url);
              window.location = data.url;
            });

            preparation.fail(function() {
              logger.error('Failed to log out of payment provider', data.provider);
              return app.error.render({errorCode: 'PROVIDER_LOGOUT_FAIL'});
            });

          } else {
            utils.trackEvent({'action': 'payment',
                              'label': 'Invalid Redirect URL'});
            logger.log('Redirect url supplied but was invalid ' + data.url);
            return app.error.render({errorCode: 'INVALID_REDIR_URL'});
          }
        } else {
          logger.log('transaction completed; closing pay flow');
          trackClosePayFlow();
          utils.mozPaymentProvider.paymentSuccess();
        }
      } else if (data.status === utils.bodyData.transStatusFailed) {
        clear();
        app.throbber.close();
        logger.log('transaction failed');
        return app.error.render({errorCode: 'TRANS_FAILED'});

      } else if (data.status === utils.bodyData.transStatusCancelled) {
        clear();
        logger.log('[wait] payment cancelled by user; closing pay flow');
        trackClosePayFlow();
        // This string is used to determine the message on Marketplace;
        // change it at your peril.
        utils.mozPaymentProvider.paymentFailed('USER_CANCELLED');
      } else {
        // The transaction is in some kind of incomplete state.
        logger.log('[wait] transaction status: ' + data.status +'; expecting: ' + expectedStatus);
        pollTimeout = window.setTimeout(function() {
          poll(expectedStatus);
        }, settings.poll_interval);
      }
    });

    request.fail(function($xhr, textStatus) {

      if (textStatus === 'timeout') {
        clear();
        logger.log('transaction request timed out');
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
        logger.log('error checking transaction');
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
