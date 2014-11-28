define([
  'cancel',
  'i18n-abide-utils',
  'jquery',
  'log',
  'utils',
], function(cancel, i18n, $, log, utils) {

  'use strict';

  var logger = log('lib', 'auth');
  var gettext = i18n.gettext;

  function showRetryError(options) {
    var errCode = options.errCode;
    var assertion = options.assertion;
    var reverify = options.reverify || false;

    app.error.render({
      heading: gettext('Oops'),
      errorCode: errCode,
      ctaText: gettext('Retry?'),
      ctaCallback: function(e){
        e.preventDefault();
        app.error.close();
        app.throbber.render(gettext('Retrying'));
        verifyUser(assertion, {reverify: reverify});
      }
    });
  }

  function showFxARetryError(options) {
    options = options || {};
    var reverify = options.reverify || false;
    app.error.render({
      ctaText: gettext('Retry?'),
      errorCode: options.errCode,
      ctaCallback: function(e){
        e.preventDefault();
        app.error.close();
        app.throbber.render(gettext('Retrying'));
        verifyFxAUser(options.code, {reverify: reverify});
      }
    });
  }

  function verifyFxAUser(code, options) {
    options = options || {};
    var reverify = options.reverify || false;
    var url = utils.bodyData.fxaCallbackUrl;
    var data = {
      auth_response: code,
      state: utils.bodyData.fxaState
    };

    var req = $.ajax({url: url, type: 'POST', data: data});

    req.done(function(data) {
      logger.log('FxA login success');
      utils.trackEvent({'action': 'FxA login',
                        'label': 'Success'});
      app.session.set('user_hash', data.user_hash);
      app.session.set('logged_in_user', data.user_email);
      if (reverify === true) {
        logger.log("Reverifying FxA login");
        // Set logged_in and manually direct to reset-pin which is
        // implied having successfully carried out a re-auth.
        app.session.set('logged_in', true, {silent: true});
        app.router.showResetPin();
      } else {
        // Setting the attr will cause the listeners
        // to deal with login success.
        app.session.set('logged_in', true);
      }
    });

    req.fail(function($xhr, textStatus) {
      logger.log(textStatus);
      logger.log($xhr.status);
      if (textStatus === 'timeout') {
        logger.log('login timed out');
        utils.trackEvent({'action': 'FxA login',
                          'label': 'Timed Out'});
        return showFxARetryError({
          errCode: 'FXA_TIMEOUT',
          msg: gettext('This is taking longer than expected. Try again?'),
          reverify: reverify
        });
      } else if ($xhr.status === 403) {
        logger.log('permission denied after auth');
        utils.trackEvent({'action': 'FxA login',
                          'label': 'Permission Denied'});
        return app.error.render({errorCode: 'FXA_DENIED'});
      } else {
        logger.log('login error');
        utils.trackEvent({'action': 'FxA login',
                          'label': 'Failed'});
        return showFxARetryError({
          code: code,
          errCode: 'FXA_FAILED',
          reverify: reverify
        });
      }
    });
  }

  function verifyUser(assertion, options) {

    options = options || {};
    var reverify = options.reverify || false;
    var url = reverify === true ? utils.bodyData.reverifyUrl : utils.bodyData.verifyUrl;

    var prefix = reverify === true ? 'Reverify' : 'Verify';
    var prefixUC = prefix.toUpperCase();

    if (!url) {
      logger.log('Error: No url. Please set one. Bailing out!');
      return app.error.render({errorCode: prefixUC + '_MISSING_URL'});
    }

    logger.log(prefix + 'ing assertion');

    var reqConfig = {
      type: 'POST',
      url: url,
      data: {assertion: assertion}
    };

    logger.log(reqConfig.url);

    var req = $.ajax(reqConfig);
    req.done(function(data) {
      logger.log(prefix + ' success');
      utils.trackEvent({'action': 'persona login',
                        'label': prefix + ' Success'});
      app.session.set('user_hash', data.user_hash);
      if (reverify === true) {
        // Set logged_in and manually direct to reset-pin which is
        // implied having successfully carried out a re-auth.
        app.session.set('logged_in', true, {silent: true});
        app.router.showResetPin();
      } else {
        // Setting the attr will cause the listeners
        // to deal with login success.
        app.session.set('logged_in', true);
      }
    }).fail(function($xhr, textStatus) {
      logger.log(textStatus);
      logger.log($xhr.status);
      if (textStatus === 'timeout') {
        logger.log('login timed out');
        utils.trackEvent({'action': 'persona login',
                          'label': prefix + ' Timed Out'});
        return showRetryError({
          assertion: assertion,
          errCode: prefixUC + '_TIMEOUT',
          msg: gettext('This is taking longer than expected. Try again?'),
          reverify: reverify,
        });
      } else if ($xhr.status === 403) {
        logger.log('permission denied after auth');
        utils.trackEvent({'action': 'persona login',
                          'label': prefix + ' Permission Denied'});
        return app.error.render({errorCode: prefixUC + '_DENIED'});
      } else {
        logger.log('login error');
        utils.trackEvent({'action': 'persona login',
                          'label': prefix + ' Failed'});
        return showRetryError({
          assertion: assertion,
          errCode: prefixUC + '_FAILED',
          reverify: reverify,
        });
      }
    });

    return req;
  }

  function resetUser() {
    logger.log('Begin webpay user reset');
    var reqConfig = {
      type: 'POST',
      url: utils.bodyData.resetUserUrl
    };

    var req = $.ajax(reqConfig);

    req.done(function _resetSuccess() {
      logger.log('reset webpay user');
      utils.trackEvent({'action': 'webpay user reset',
                        'label': 'Reset User Success'});
    }).fail(function _resetFail($xhr, textStatus, errorThrown) {
      logger.log('error resetting user:', textStatus, errorThrown);
      utils.trackEvent({'action': 'webpay user reset',
                        'label': 'Reset User Error'});
    });
    return req;
  }

  function startFxA(reverify) {
    verifyFxAUser(window.location.href, {reverify: reverify});
  }

  return {
    resetUser: resetUser,
    showRetryError: showRetryError,
    startFxA: startFxA,
    verifyUser: verifyUser,
  };

});
