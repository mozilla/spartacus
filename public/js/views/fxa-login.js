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
      console.log("FxA login clicked, redirecting to " + utils.bodyData.fxaUrl);
      e.preventDefault();
      window.location.href = utils.bodyData.fxaUrl;
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
