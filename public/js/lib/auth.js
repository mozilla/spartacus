define([
  'cancel',
  'i18n-abide-utils',
  'id',
  'jquery',
  'log',
  'utils',
], function(cancel, i18n, id, $, log, utils) {

  'use strict';

  var console = log('auth');
  var loginTimer;
  var gettext = i18n.gettext;


  function showRetryError(assertion, errCode, msg) {
    msg = msg || gettext('Something went wrong. Try again?');
    app.error.render({
      context: {
        heading: gettext('Oops&hellip;'),
        errorCode: errCode,
        msg: msg,
      },
      events: {
        'click .button.cancel': cancel.callPayFailure,
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
      data: {assertion: assertion}
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
        showRetryError(assertion, 'LOGIN_TIMEOUT', gettext('This is taking longer than expected. Try again?'));
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
