define([
  'id',
  'log',
  'settings',
  'underscore',
  'views/base'
], function(id, log, settings, _, BaseView){

  'use strict';

  var console = log('view', 'login');
  var LoginView = BaseView.extend({

    events: {
      'click #signin': 'handleSignIn'
    },

    handleSignIn: function(e) {
      app.error.hide();
      var that = this;
      if (e) {
        e.preventDefault();
      }
      app.throbber.render(this.gettext('Connecting to Persona'));
      id.request();
      app.AppView.loginTimer = window.setTimeout(_.bind(function() {
        this.onLoginTimeout(that.handleSignIn);
      }, app.AppView), settings.login_timeout);
    },

    render: function(){
      console.log('rendering login view');
      this.setTitle(this.gettext('Sign In'));
      this.renderTemplate('login.html', {
        heading: this.gettext('Sign In'),
        msg: this.gettext('Sign in to continue with the payment')
      });
      app.throbber.hide();
      return this;
    }

  });

  return LoginView;
});
