define([
  'cancel',
  'i18n-abide-utils',
  'id',
  'jquery',
  'log',
  'provider',
  'utils',
], function(cancel, i18n, id, $, log, provider, utils) {

  'use strict';

  var console = log('auth');
  var gettext = i18n.gettext;

  function showRetryError(options) {
    var errCode = options.errCode;
    var assertion = options.assertion;
    var msg = options.msg || gettext('Something went wrong. Try again?');
    var verifyFunc = options.verifyFunc || verifyUser;

    app.error.render({
      context: {
        heading: gettext('Oops&hellip;'),
        errorCode: errCode,
        msg: msg,
      },
      events: {
        'click .button.cancel': cancel.callPayFailure,
        'click .button.cta': function(e){
          e.preventDefault();
          app.error.clear();
          app.throbber.render(gettext('Retrying...'));
          verifyFunc(assertion);
        }
      }
    });
  }

  function verifyUser(assertion) {

    console.log('Verifying assertion');

    var reqConfig = {
      type: 'POST',
      url: utils.bodyData.verifyUrl,
      data: {assertion: assertion}
    };

    console.log(reqConfig.url);

    var req = $.ajax(reqConfig);
    req.done(function() {
      console.log('Verification success');
      utils.trackEvent({'action': 'persona login',
                        'label': 'Login Success'});
      // Setting the attr will cause the listeners
      // to deal with login success.
      app.session.set('logged_in', true);
    }).fail(function($xhr, textStatus) {
      console.log(textStatus);
      console.log($xhr.status);
      if (textStatus === 'timeout') {
        console.log('login timed out');
        utils.trackEvent({'action': 'persona login',
                          'label': 'Verification Timed Out'});
        showRetryError({
          assertion: assertion,
          errCode: 'LOGIN_TIMEOUT',
          msg: gettext('This is taking longer than expected. Try again?'),
        });
      } else if ($xhr.status === 403) {
        console.log('permission denied after auth');
        utils.trackEvent({'action': 'persona login',
                          'label': 'Login Permission Denied'});
        app.error.render({context: {errorCode: 'VERIFY_DENIED'}, showCta: false});
      } else {
        console.log('login error');
        utils.trackEvent({'action': 'persona login',
                          'label': 'Login Failed'});
        showRetryError({
          assertion: assertion,
          errCode: 'LOGIN_FAILED',
        });

      }
    });

    return req;
  }

  function reVerifyUser(assertion) {
    console.log('Re-verifying assertion');

    var reqConfig = {
      type: 'POST',
      url: utils.bodyData.reverifyUrl,
      data: {assertion: assertion},
    };

    var req = $.ajax(reqConfig);

    req.done(function _resetLoginSuccess() {
    //req.done(function _resetLoginSuccess(data) {
      console.log('login success');
      //provider.prepareAll(data.user_hash).done(function _forceAuthReady() {
      utils.trackEvent({'action': 'reset force auth',
                        'label': 'Login Success'});
      app.router.navigate('reset-pin', {trigger: true});
      //});
    }).fail(function _resetLoginError($xhr, textStatus) {
      if (textStatus === 'timeout') {
        console.log('login timed out');
        utils.trackEvent({'action': 'reset force auth',
                          'label': 'Re-verification Timed Out'});
        showRetryError({
          assertion: assertion,
          errCode: 'REVERIFY_TIMEOUT',
          msg: gettext('That took longer than expected. Retry?'),
          verifyFunc: reVerifyUser
        });
      } else if ($xhr.status === 403) {
        console.log('login error');
        utils.trackEvent({'action': 'reset force auth',
                          'label': 'Permission Denied'});
        app.error.render({context: {errorCode: 'REVERIFY_DENIED'}, showCta: false});
      } else {
        console.log('login error');
        utils.trackEvent({'action': 'reset force auth',
                          'label': 'Login Failure'});
        showRetryError({
          assertion: assertion,
          errCode: 'REVERIFY_FAILED',
          verifyFunc: reVerifyUser
        });
      }
    });
  }

  function resetUser() {
    console.log('Begin webpay user reset');

    var reqConfig = {
      type: 'POST',
      url: utils.bodyData.resetUserUrl
    };

    var req = $.ajax(reqConfig);
    req.done(function _resetSuccess() {
      console.log('reset webpay user');
      window.localStorage.clear();
      utils.trackEvent({'action': 'webpay user reset',
                        'label': 'Reset User Success'});
    }).fail(function _resetFail($xhr, textStatus, errorThrown) {
      console.log('error resetting user:', textStatus, errorThrown);
      utils.trackEvent({'action': 'webpay user reset',
                        'label': 'Reset User Error'});
    });
    return req;
  }

  return {
    resetUser: resetUser,
    showRetryError: showRetryError,
    verifyUser: verifyUser,
    reVerifyUser: reVerifyUser
  };

});
