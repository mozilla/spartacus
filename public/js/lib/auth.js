define([
  'id',
  'jquery',
  'log',
  'utils',
  'settings'
], function(id, $, log, utils, settings) {

  'use strict';

  var console = log('auth');
  var loginTimer;

  return {

    verifyUser: function(assertion) {

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
          app.error.render({
            context: {
              errorCode: 'VERIFICATION_TIMEOUT'
            },
            events: {
              'click .button.cta': function(){ $.ajax(reqConfig); }
            }
          });
        } else if ($xhr.status === 403) {
          console.log('permission denied after auth');
          utils.trackEvent({'action': 'persona login',
                            'label': 'Login Permission Denied'});
          app.error.render({
            context: {
              errorCode: 'VERIFICATION_DENIED'
            },
            events: {
              'click .button.cta': function(){ $.ajax(reqConfig); }
            }
          });

        } else {
          console.log('login error');
          utils.trackEvent({'action': 'persona login',
                            'label': 'Login Failed'});
          app.error.render({
            context: {
              errorCode: 'LOGIN_FAILED'
            },
            events: {
              'click .button.cta': function(){ $.ajax(reqConfig); }
            }
          });

        }
      });

      return req;
    },

    resetUser: function _resetUser() {
      console.log('Begin webpay user reset');

      var reqConfig = {
        'type': 'POST',
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
  };

});
