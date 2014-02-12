define(['views/base', 'log'], function(BaseView, log){
  var console = log('view', 'login');
  var LoginView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle('Locked Pin');
      this.renderTemplate('login.html', {heading: 'Login'});
      return this;
    }
  });
  // Our module now returns our view
  return LoginView;
});
