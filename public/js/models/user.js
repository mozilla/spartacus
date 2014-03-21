define([
  'jquery',
  'underscore',
  'backbone',
  'id',
  'log',
  'models/base',
  'settings',
  'utils',
  'views/error-overlay',
  'views/throbber'
], function($, _, Backbone, id, log, BaseModel, settings, utils, ErrorOverlay, throbber){

  'use strict';

  var loginTimer = null;
  var console = log('model', 'user');

  var UserModel = BaseModel.extend({

    // Initialization of the model. Event listeners and setup should happen here.
    initialize: function(){
      _.bindAll(this, 'handleLoginStateChange', 'loginHandler', 'logoutHandler', 'watchIdentity');
      this.on('change:logged_in', this.handleLoginStateChange);
    },

    defaults: {
      logged_in: null,
      // Whether the user has a pin.
      pin: false,
      // Date object for when the pin was locked.
      pin_locked_out: null,
      // If the user has a locked pin
      pin_is_locked_out: null,
      // If the user was previously locked out.
      pin_was_locked_out: null
    },

    baseURL: utils.bodyData.baseApiURL || '',

    url: '/mozpay/v1/api/pin/',

    // Takes the data retrieved from the API and works out how to
    // dispatch the user based on the reponse.
    handleUserState: function(data) {

      if (data.pin_is_locked_out === true) {
        console.log('User is locked out. Navigating to /locked');
        return app.router.navigate('/locked', {trigger: true});
      } else if (data.pin_was_locked_out === true) {
        console.log('User was locked out. Navigating to /was-locked');
        return app.router.navigate('/was-locked', {trigger: true});
      } else if (data.pin === true) {
        console.log('User has a pin so navigate to /enter-pin');
        return app.router.navigate('/enter-pin', {trigger: true});
      } else {
        console.log('User has no pin so navigate to /create-pin');
        return app.router.navigate('/create-pin', {trigger: true});
      }
    },

    // Runs fetch to get the current model state.
    getUserState: function() {
      // Check the user's state
      console.log('Fetching model state');
      this.fetch()
        .done(this.handleUserState)
        .fail(function(){
          console.log('fail');
        });
    },

    // When the `logged_in` attr changes this function decides
    // if login is required or if the user is logged in it hands off to
    // checking the User's state e.g. if the user has a PIN or if the user
    // is currently locked out.
    handleLoginStateChange: function() {
      var logged_in = this.get('logged_in');
      console.log('logged_in state changed to ' + logged_in);
      if (logged_in === false) {
        console.log('navigating to /login');
        app.router.navigate('/login', {trigger: true});
      } else {
        this.getUserState();
      }
    },

    // Runs navigator.id.watch via Persona.
    watchIdentity: function() {
      id.watch({
        onlogin: this.loginHandler,
        onlogout: this.logoutHandler,
      });
    },

    // Runs the logout for the user.
    logoutHandler: function() {
      this.set({'logged_in': false});
      this.resetUser();
    },

    // Carries out resetting the user.
    // TODO: Needs timers.
    resetUser: function _resetUser() {
      var console = log('UserModel', 'resetUser');
      console.log('Begin webpay user reset');
      var request = {
        'type': 'POST',
        url: utils.bodyData.resetUserUrl
      };
      var result = $.ajax(request)
        .done(function _resetSuccess() {
          console.log('reset webpay user');
          window.localStorage.clear();
          utils.trackEvent({'action': 'webpay user reset',
                            'label': 'Reset User Success'});
        })
        .fail(function _resetFail($xhr, textStatus, errorThrown) {
          console.log('error resetting user:', textStatus, errorThrown);
          utils.trackEvent({'action': 'webpay user reset',
                            'label': 'Reset User Error'});
        });
      return result;
    },

    // Handle login from id.watch. Here is where verification occurs.
    // TODO: needs timers.
    loginHandler: function(assertion) {

      if (loginTimer) {
        console.log('Clearing login timer');
        window.clearTimeout(loginTimer);
      }

      throbber.show(this.gettext('Connecting to Persona'));
      console.log('Verifying assertion');

      $.ajax({
        type: 'POST',
        url: utils.bodyData.verifyUrl,
        data: {assertion: assertion},
        timeout: settings.ajax_timeout,
        success: _.bind(function() {
          console.log('verification success');
          utils.trackEvent({'action': 'persona login',
                            'label': 'Login Success'});
          this.set({'logged_in': true});
          //bango.prepareAll(data.user_hash).done(function _onDone() {
          //  callback(data);
          //});
        }, this),
        error: _.bind(function(xhr, textStatus) {
          if (textStatus === 'timeout') {
            console.log('login timed out');
            utils.trackEvent({'action': 'persona login',
                              'label': 'Verification Timed Out'});
            //var that = this;
            //cli.showFullScreenError({callback: function(){ $.ajax(that); },
            //                         errorCode: 'INTERNAL_TIMEOUT'});
            // TODO: Show retry.
          } else if (xhr.status === 403) {
            console.log('permission denied after auth');
            utils.trackEvent({'action': 'persona login',
                              'label': 'Login Permission Denied'});
            //window.location.href = bodyData.deniedUrl;
            // TODO: Show error message.
          } else {
            console.log('login error');
            utils.trackEvent({'action': 'persona login',
                              'label': 'Login Failed'});
            this.set({'logged_in': false});
          }
        }, this)
      });
    },
  });

  return UserModel;
});


