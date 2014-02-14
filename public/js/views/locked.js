define(['views/base', 'gettext', 'log'], function(BaseView, gettext, log){
  var console = log('view', 'locked');
  var gt = gettext.gettext;
  var LockedView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle('Locked');
      this.renderTemplate('locked.html', {
        'heading': gt('Error'),
        'msg': gt('You entered the wrong pin too many times. Your account is locked. Please try your purchase again in 5 minutes.')
      });
      return this;
    }
  });
  // Our module now returns our view
  return LockedView;
});
