define([
  'jquery',
  'underscore',
  'backbone',
  'id',
  'log',
  'models/base',
  'settings',
  'utils',
  'views/throbber'
], function($, _, Backbone, id, log, BaseModel, settings, utils, throbber){

  var loginTimer = null;
  var console = log('model', 'user');

  var UserModel = BaseModel.extend({

    initialize: function(){
      _.bindAll(this, 'checkAuth', 'handleLoginStatechange', 'loginHandler', 'logoutHandler');
      this.on('change:logged_in', this.handleLoginStatechange);
    },

    defaults: {
      logged_in: null,
    },

    handleLoginStatechange: function() {
      if (this.get('logged_in') === false) {
        console.log('navigating to /login');
        app.router.navigate('/login', {trigger: true});
      } else {
        // TODO: More advanced logic here to check state.
        if (Backbone.history.fragment === 'enter-pin') {
          // If we're already trying to get to 'enter-pin' navigating to it
          // won't cause it to be re-rendered so force it to be rendered by
          // calling the view direct.
          console.log('Already on Enter Pin. Re-rendering');
          app.router.showEnterPin();
        } else {
          console.log('navigating to /enter-pin');
          app.router.navigate('/enter-pin', {trigger: true});
        }
      }
    },

    checkAuth: function() {
      id.watch({
        onlogin: this.loginHandler,
        onlogout: this.logoutHandler,
      });
    },

    logoutHandler: function() {
      var self = this;
      self.set({'logged_in': false});
      self.resetUser();
    },

    resetUser: function _resetUser() {
      var console = log('UserModel', 'resetUser');
      console.log('Begin webpay user reset');
      var request = {
        'type': 'POST',
        url: utils.bodyData.resetUserUrl,
        headers: {'X-CSRFToken': $('meta[name=csrf]').attr('content')}
      };
      var result = $.ajax(request)
        .done(function _resetSuccess() {
          console.log('reset webpay user');
          window.localStorage.clear();
          utils.trackWebpayEvent({'action': 'webpay user reset',
                                  'label': 'Reset User Success'});
        })
        .fail(function _resetFail($xhr, textStatus, errorThrown) {
          console.log('error resetting user:', textStatus, errorThrown);
          utils.trackWebpayEvent({'action': 'webpay user reset',
                                  'label': 'Reset User Error'});
        });
      return result;
    },

    loginHandler: function(assertion) {

      if (loginTimer) {
        console.log('Clearing login timer');
        window.clearTimeout(loginTimer);
      }

      throbber.show(this.gettext('Connecting to Persona'));

      $.ajax({
        type: 'POST',
        url: utils.bodyData.verifyUrl,
        data: {assertion: assertion},
        timeout: settings.ajax_timeout,
        success: _.bind(function() {
          console.log('verification success');
          utils.trackWebpayEvent({'action': 'persona login',
                                  'label': 'Login Success'});
          this.set({'logged_in': true});
          //bango.prepareAll(data.user_hash).done(function _onDone() {
          //  callback(data);
          //});
        }, this),
        error: _.bind(function(xhr, textStatus ) {
          if (textStatus === 'timeout') {
            console.log('login timed out');
            utils.trackWebpayEvent({'action': 'persona login',
                                    'label': 'Verification Timed Out'});
            //var that = this;
            //cli.showFullScreenError({callback: function(){ $.ajax(that); },
            //                         errorCode: 'INTERNAL_TIMEOUT'});
            // TODO: Show retry.
          } else if (xhr.status === 403) {
            console.log('permission denied after auth');
            utils.trackWebpayEvent({'action': 'persona login',
                                    'label': 'Login Permission Denied'});
            //window.location.href = bodyData.deniedUrl;
            // TODO: Show error message.
          } else {
            console.log('login error');
            utils.trackWebpayEvent({'action': 'persona login',
                                    'label': 'Login Failed'});
            this.set({'logged_in': false});
          }
        }, this)
      });
    },
  });

  return UserModel;
});


