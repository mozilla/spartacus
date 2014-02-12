define(['views/base', 'log'], function(BaseView, log){
  var console = log('view', 'locked');
  var LockedView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle('Locked');
      this.renderTemplate('locked.html');
      return this;
    }
  });
  // Our module now returns our view
  return LockedView;
});
