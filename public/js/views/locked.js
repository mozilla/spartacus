define(['views/base', 'log'], function(BaseView, log){
  var console = log('view', 'locked');
  var LockedView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle(this.gettext('Locked'));
      this.renderTemplate('locked.html', {
        'heading': this.gettext('Error'),
        'msg': this.gettext('You entered the wrong pin too many times. Your account is locked. Please try your purchase again in 5 minutes.')
      });
      return this;
    }
  });
  // Our module now returns our view
  return LockedView;
});
