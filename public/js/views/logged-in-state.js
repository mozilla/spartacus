define([
  'log',
  'underscore',
  'utils',
  'views/page'
], function(log, _, utils, PageView){

  'use strict';

  /*
   * This view is an interstitial view shown to give the user the opportunity to logout.
   * prior to continuing with the flow.
   */
  var logger = log('views', 'logged-in-state');
  var LoggedInStateView = PageView.extend({

    events: {
      'click .logout': 'handleLogout',
      'click .cta': 'handleContinue'
    },

    handleLogout: function(e) {
      logger.log("Logging out at user's request");
      e.preventDefault();
      app.session.logout();
    },

    handleContinue: function(e) {
      e.preventDefault();
      logger.log('Continuing with implied login');
      app.session.set('logged_in', true);
      app.session.set('user_hash', false);
    },

    render: function(){
      logger.log('rendering logged-in-state view');
      // Renders the default title.
      this.setTitle();
      this.renderTemplate('signout.html', {
        email: utils.bodyData.loggedInUser,
      });
      app.throbber.close();
      return this;
    }

  });

  return LoggedInStateView;
});
