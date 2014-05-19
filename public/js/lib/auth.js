define([
  'cancel',
  'i18n-abide-utils',
  'id',
  'jquery',
  'log',
  'utils',
  'settings'
], function(cancel, i18n, id, $, log, utils, settings) {

  'use strict';

  var console = log('auth');
  var loginTimer;
  var gettext = i18n.gettext;


  function showRetryError(assertion, errCode, msg) {
    msg = msg || gettext('Oops something went wrong. Retry?');
    app.error.render({
      context: {
        errorCode: errCode,
        msg: msg,
      },
      events: {
        'click .button.cancel': function(){
          app.error.clear();
          cancel.callPayFailure();
        },
        'click .button.cta': function(){
          app.error.clear();
          app.throbber.render(gettext('Retrying...'));
          verifyUser(assertion);
        }
      }
    });
  }

  function verifyUser(assertion) {

    if (loginTimer) {
      console.log('Clearing login timer');
      window.clearTimeout(loginTimer);
    }
    console.log('Verifying assertion');

    var reqConfig = {
      type: 'POST',
      url: utils.bodyData.verifyUrl,
      data: {assertion: assertion},
      timeout: settings.ajax_timeout
    };

    var req = $.ajax(reqConfig);
    req.done(function() {
      console.log('Verification success');
      utils.trackEvent({'action': 'persona login',
                        'label': 'Login Success'});
      // Setting the attr will cause the listeners
      // to deal with login success.
      app.session.set('logged_in', true);
    }).fail(function($xhr, textStatus) {
      if (textStatus === 'timeout') {
        console.log('login timed out');
        utils.trackEvent({'action': 'persona login',
                          'label': 'Verification Timed Out'});
        showRetryError(assertion, 'LOGIN_TIMEOUT', gettext('That took longer than expected. Retry?'));
      } else if ($xhr.status === 403) {
        console.log('permission denied after auth');
        utils.trackEvent({'action': 'persona login',
                          'label': 'Login Permission Denied'});
        app.error.render({context: {errorCode: 'VERIFICATION_DENIED'}, showCta: false});
      } else {
        console.log('login error');
        utils.trackEvent({'action': 'persona login',
                          'label': 'Login Failed'});
        showRetryError(assertion, 'LOGIN_FAILED');
      }
    });

    return req;
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
    verifyUser: verifyUser
  };

});
