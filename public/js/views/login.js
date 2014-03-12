define(['underscore', 'views/base', 'log', 'id', 'views/throbber'], function(_, BaseView, log, id, throbber){
  var console = log('view', 'login');
  var LoginView = BaseView.extend({

    initialize: function() {
      _.bindAll(this, 'renderTemplate', 'render');
    },

    events: {
      'click #signin': 'handleSignIn'
    },

    handleSignIn: function(e) {
      id.request();
      e.preventDefault();
    },

    render: function(){
      console.log('rendering login view');
      this.setTitle(this.gettext('Sign In'));
      this.renderTemplate('login.html', {heading: 'Sign In'});
      throbber.hide();
      return this;
    }

  });
  // Our module now returns our view
  return LoginView;
});
