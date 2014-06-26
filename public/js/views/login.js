define([
  'id',
  'log',
  'underscore',
  'views/page'
], function(id, log, _, PageView){

  'use strict';

  var console = log('view', 'login');
  var LoginView = PageView.extend({

    events: {
      'click #signin': 'handleSignIn'
    },

    handleSignIn: function(e) {
      e.preventDefault();
      app.throbber.render(this.gettext('Connecting to Persona'));
      id.request();
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
