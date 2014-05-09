define([
  'id',
  'log',
  'underscore',
  'views/base'
], function(id, log, _, BaseView){

  'use strict';

  var console = log('view', 'login');
  var LoginView = BaseView.extend({

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
      this.renderTemplate('login.html', {heading: 'Sign In'});
      app.throbber.hide();
      return this;
    }

  });

  return LoginView;
});
