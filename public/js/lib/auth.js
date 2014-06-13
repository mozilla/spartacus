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
    var reverify = options.reverify || false;

    app.error.render({
      context: {
        heading: gettext('Oops…'),
        errorCode: errCode,
        msg: msg,
      },
      ctaCallback: function(e){
        e.preventDefault();
        app.error.clear();
        app.throbber.render(gettext('Retrying...'));
        verifyUser(assertion, {reverify: reverify});
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
      console.log('Error: No url. Please set one. Bailing out!');
      app.error.render({context: {errorCode: 'MISSING_' + prefixUC + '_URL'}});
      return;
    }

    console.log(prefix + 'ing assertion');

    var reqConfig = {
      type: 'POST',
      url: url,
      data: {assertion: assertion}
    };

    console.log(reqConfig.url);

    var req = $.ajax(reqConfig);
    req.done(function() {
      console.log(prefix + ' success');
      utils.trackEvent({'action': 'persona login',
                        'label': prefix + ' Success'});
      if (reverify === true) {
        // Set logged_in and manually direct to reset-pin which is
        // implied having successfully carried out a re-auth.
        app.session.set('logged_in', true, {silent: true});
        app.router.navigate('reset-pin', {trigger: true});
      } else {
        // Setting the attr will cause the listeners
        // to deal with login success.
        app.session.set('logged_in', true);
      }
    }).fail(function($xhr, textStatus) {
      console.log(textStatus);
      console.log($xhr.status);
      if (textStatus === 'timeout') {
        console.log('login timed out');
        utils.trackEvent({'action': 'persona login',
                          'label': prefix + ' Timed Out'});
        showRetryError({
          assertion: assertion,
          errCode: prefixUC + '_TIMEOUT',
          msg: gettext('This is taking longer than expected. Try again?'),
          reverify: reverify,
        });
      } else if ($xhr.status === 403) {
        console.log('permission denied after auth');
        utils.trackEvent({'action': 'persona login',
                          'label': prefix + ' Permission Denied'});
        app.error.render({context: {errorCode: prefixUC + '_DENIED'}});
      } else {
        console.log('login error');
        utils.trackEvent({'action': 'persona login',
                          'label': prefix + ' Failed'});
        showRetryError({
          assertion: assertion,
          errCode: prefixUC + '_FAILED',
          reverify: reverify,
        });
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
    verifyUser: verifyUser,
  };

});
