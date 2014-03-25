define([
  'jquery',
  'underscore',
  'backbone',
  'id',
  'lib/pin',
  'log',
  'models/base',
  'settings',
  'utils',
  'views/error-overlay',
  'views/throbber'
], function($, _, Backbone, id, pin, log, BaseModel, settings, utils, ErrorOverlay, throbber){

  'use strict';

  var loginTimer = null;
  var console = log('model', 'user');

  var getURL = function getURL(urlSuffix) {
    return BaseModel.prototype.getURL(urlSuffix);
  };

  var UserModel = BaseModel.extend({

    // Initialization of the model. Event listeners and setup should happen here.
    initialize: function(){
      _.bindAll(this, 'getUserState', 'handleLoginStateChange', 'loginHandler', 'logoutHandler', 'watchIdentity');
      this.on('change:logged_in', this.handleLoginStateChange);
      this.on('change:pin_is_locked_out', this.handlePinLockedOut);
      this.on('change:pin_was_locked_out', this.handlePinWasLockedOut);
      this.on('change:ready_to_start_payment', this.handleReadyToStartPayment);
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
      pin_was_locked_out: null,
      // ready_to_start_payment
      ready_to_start_payment: null,
    },

    // The PIN endpoint.
    // * Checks state with GET
    // * Creates PIN with a POST
    // * Updates PIN with a PATCH
    url: getURL('/pin/'),

    // Check PIN url.
    checkURL: getURL('/pin/check/'),

    // Pay URL. Start a purchase.
    payURL: getURL('/pay/'),

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


    // Get the user model.
    getUserState: function() {
      // Check the user's state
      console.log('Fetching model state');

      var reqConfig = {
        'url': this.url
      };

      console.log(JSON.stringify(reqConfig));

      var req = $.ajax(reqConfig);
      req.done(_.bind(function(data, textStatus, $xhr) {
        var model = this.model;
        console.log($xhr.status);
        if ($xhr.status === 200) {
          model.handleUserState(data);
        } else {
          $xhr.reject();
        }
      }, {model: this})).fail(function($xhr, textStatus){
        // TODO Error handling here.
        console.log($xhr.status);
        console.log(textStatus);
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

    handlePinLockedOut: function() {
      // TODO: Navigate to the pin locked out page.
    },

    handlePinWasLockedOut: function() {
      // TODO: Navigate to the was locked out page.
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
    // TODO: Maybe move this to auth module?
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
    },

    checkPin: function(pinData) {

      throbber.show(this.gettext('Verifying Pin'));
      var pinCheckAction = 'check-pin';

      var reqConfig = {
        type: 'POST',
        url: this.checkURL,
        data: {pin: pinData},
        timeout: settings.ajax_timeout
      };

      var req = $.ajax(reqConfig);
      req.done(function(data, textStatus, $xhr) {
        if ($xhr.status === 200) {
          app.router.navigate('/wait-for-tx', {trigger: true});
        } else {
          $xhr.reject();
        }
      }).fail(_.bind(function($xhr, textStatus) {

        // TODO: If data is available update model attrs so that
        // pin_is_locked_out attr listeners can deal with locked state.
        var error = new ErrorOverlay();

        if (textStatus === 'timeout') {
          console.log('Request timed out');
          utils.trackEvent({'action': pinCheckAction,
                            'label': 'Pin Check API Call Timed Out'});
          error.render({'buttonText': 'Retry?', buttonFunc: function() {
            $.ajax(this.reqConfig);
          }, errorCode: 'ENTER_PIN_REQ_TIMEOUT'});
        } else if ($xhr.status === 400) {
          console.log('Pin data invalid');
          utils.trackEvent({'action': pinCheckAction,
                            'label': 'Pin Check API Call Invalid Form Data'});
          throbber.hide();
          pin.resetPinUI();
          pin.showError(this.model.gettext('Pin invalid'));
        } else if ($xhr.status === 403) {
          console.log('User not authenticated');
          utils.trackEvent({'action': pinCheckAction,
                            'label': 'Pin Check API Call Permission Denied'});
          error.render({errorCode: 'PIN_ENTER_PERM_DENIED'});
        } else if ($xhr.status === 404) {
          console.log("User doesn't exist");
          utils.trackEvent({'action': pinCheckAction,
                            'label': "Pin Check API Call User Doesn't exist"});
          error.render({errorCode: 'PIN_ENTER_USER_DOES_NOT_EXIST'});
        } else {
          console.log("Unhandled error");
          utils.trackEvent({'action': pinCheckAction,
                            'label': "Pin Check API Call Unhandled error"});
          error.render({errorCode: 'PIN_ENTER_UNHANDLED_ERROR'});
        }
      }, {model: this, reqConfig: reqConfig}));

      return req;
    },

    createPin: function(pin) {
      throbber.show(this.gettext('Creating Pin'));
      var pinCreateAction = 'create-pin';

      var reqConfig = {
        type: 'POST',
        url: this.url,
        data: {pin: pin},
        timeout: settings.ajax_timeout
      };

      var req = $.ajax(reqConfig);

      req.done(function(data, textStatus, $xhr) {
        if ($xhr.status === 201) {
          app.router.navigate('/wait-for-tx', {trigger: true});
        } else {
          $xhr.reject();
        }
      }).fail(function($xhr, textStatus) {
        var error = new ErrorOverlay();

        if (textStatus === 'timeout') {
          console.log('Request timed out');
          utils.trackEvent({'action': pinCreateAction,
                            'label': 'Pin Create API Call Timed Out'});
          error.render({'buttonText': 'Retry?', buttonFunc: function() {
            $.ajax(this.reqConfig);
          }, errorCode: 'CREATE_PIN_REQ_TIMEOUT'});
        } else if ($xhr.status === 400) {
          console.log('Pin data invalid');
          utils.trackEvent({'action': pinCreateAction,
                            'label': 'Pin Create API Call Invalid Form Data'});
          error.render({errorCode: 'PIN_CREATE_INVALID'});
        } else if ($xhr.status === 403) {
          console.log('User not authenticated');
          utils.trackEvent({'action': pinCreateAction,
                            'label': 'Pin Create API Call Permission Denied'});
          error.render({errorCode: 'PIN_CREATE_PERM_DENIED'});
        } else if ($xhr.status === 404) {
          console.log("User doesn't exist");
          utils.trackEvent({'action': pinCreateAction,
                            'label': "Pin Create API Call User Doesn't exist"});
          error.render({errorCode: 'PIN_CREATE_USER_DOES_NOT_EXIST'});
        } else {
          console.log("Unhandled error");
          utils.trackEvent({'action': pinCreateAction,
                            'label': "Pin Create API Call Unhandled error"});
          error.render({errorCode: 'PIN_CREATE_UNHANDLED_ERROR'});
        }

        return req;
      });
    },

    resetPin: function(pin) {
      throbber.show(this.gettext('Resetting Pin'));

      var pinResetAction = 'reset-pin';

      var reqConfig = {
        type: 'PATCH',
        url: this.url,
        data: {pin: pin},
        timeout: settings.ajax_timeout
      };

      var req = $.ajax(reqConfig);

      req.done(function(data, textStatus, $xhr) {
        if ($xhr.status === 204) {
          // TODO: Handle success here.
        } else {
          $xhr.reject();
        }
      }).fail(function($xhr, textStatus) {
        if (textStatus === 'timeout') {
          console.log('Request timed out');
          utils.trackEvent({'action': pinResetAction,
                            'label': 'Pin Reset API Call Timed Out'});
          // TODO: Timeout error + retry here.
        } else if ($xhr.status === 400) {
          console.log('Pin data invalid');
          utils.trackEvent({'action': pinResetAction,
                            'label': 'Pin Reset API Call Invalid Form Data'});
          // Should never happen as we pre-submit validate.
          // TODO: Throw fatal error here.
        } else if ($xhr.status === 403) {
          console.log('User not authenticated');
          utils.trackEvent({'action': pinResetAction,
                            'label': 'Pin Reset API Call Permission Denied'});
          // TODO: Change user model attrs and logout?
        } else if ($xhr.status === 404) {
          console.log("User doesn't exist");
          utils.trackEvent({'action': pinResetAction,
                            'label': "Pin Reset API Call User Doesn't exist"});
          // TODO: Show fatal error with cancel button to bail.
        } else {
          console.log("Unhandled error");
          utils.trackEvent({'action': pinResetAction,
                            'label': "Pin Reset API Call Unhandled error"});
          // TODO: Show fatal error here.
        }

        return req;
      });
    },


    // Handle login from id.watch. Here is where verification occurs.
    // TODO: needs timers.
    // TODO: maybe move this to auth module?
    loginHandler: function(assertion) {
      var console = log('xhr', 'assertion-verification');

      if (loginTimer) {
        console.log('Clearing login timer');
        window.clearTimeout(loginTimer);
      }

      throbber.show(this.gettext('Connecting to Persona'));
      console.log('Verifying assertion');

      var reqConfig = {
        type: 'POST',
        url: utils.bodyData.verifyUrl,
        data: {assertion: assertion},
        timeout: settings.ajax_timeout
      };

      var req = $.ajax(reqConfig);
      req.done(_.bind(function() {
        var model = this.model;

        console.log('Verification success');
        utils.trackEvent({'action': 'persona login',
                          'label': 'Login Success'});
        model.set({'logged_in': true});
        //bango.prepareAll(data.user_hash).done(function _onDone() {
        //  callback(data);
        //});
      }, {model: this, reqConfig: reqConfig})).fail(_.bind(function($xhr, textStatus) {

        var model = this.model;
        //var reqConfig = this.reqConfig;
        if (textStatus === 'timeout') {
          console.log('login timed out');
          utils.trackEvent({'action': 'persona login',
                            'label': 'Verification Timed Out'});
          //cli.showFullScreenError({callback: function(){ $.ajax(that); },
          //                         errorCode: 'INTERNAL_TIMEOUT'});
          // TODO: Show retry.
        } else if ($xhr.status === 403) {
          console.log('permission denied after auth');
          utils.trackEvent({'action': 'persona login',
                            'label': 'Login Permission Denied'});
          //window.location.href = bodyData.deniedUrl;
          // TODO: Show error message.
        } else {
          console.log('login error');
          utils.trackEvent({'action': 'persona login',
                            'label': 'Login Failed'});
          model.set({'logged_in': false});
        }
      },{model: this, reqConfig: reqConfig}));

      return req;
    }
  });

  return UserModel;
});
