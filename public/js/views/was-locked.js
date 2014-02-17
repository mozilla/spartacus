define(['views/base', 'log'], function(BaseView, log){
  var console = log('view', 'was-locked');
  var WasLockedView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle(this.gettext('Was Locked'));
      this.renderTemplate('was-locked.html');
      return this;
    }
  });
  // Our module now returns our view
  return WasLockedView;
});
