define([
  'auth',
  'log',
  'underscore',
  'utils',
  'views/page'
], function(auth, log, _, utils, PageView){

  'use strict';

  var console = log('view', 'fxa-login');
  var LoginView = PageView.extend({

    events: {
      'click #signin': 'handleSignIn'
    },

    handleSignIn: function(e) {
      var w = 320;
      var h = 500;
      var i = utils.getCenteredCoordinates(w, h, window);
      e.preventDefault();
      console.log("FxA login button clicked");
      window.addEventListener('message', function (msg) {
        if (!msg.data || !msg.data.auth_code || msg.origin !== window.location.origin) {
          console.log("not a login message, ignoring");
          return;
        }
        auth.verifyFxAUser(msg.data.auth_code);
      }, false);
      console.log("Launching popup for FxA: " + utils.bodyData.fxaUrl);
      window.open(
        utils.bodyData.fxaUrl, 'fxa',
          'width=' + w + ',height=' + h + ',left=' + i[0] + ',top=' + i[1]);
      app.throbber.render(this.gettext('Waiting for login'));
    },

    render: function(){
      console.log('rendering login view');
      this.setTitle(this.gettext('Sign In'));
      this.renderTemplate('login.html', {
        heading: this.gettext('Sign In'),
        msg: this.gettext('Sign in to continue with the payment')
      });
      app.throbber.close();
      return this;
    }
  });

  return LoginView;
});
