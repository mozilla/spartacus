define(['views/base', 'log'], function(BaseView, log){
  var console = log('view', 'login');
  var LoginView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle(this.gettext('Sign In'));
      this.renderTemplate('login.html', {heading: 'Sign In'});
      return this;
    }
  });
  // Our module now returns our view
  return LoginView;
});
