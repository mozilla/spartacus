define(['views/base', 'log', 'lib/pin'], function(BaseView, log, pin){
  var console = log('view', 'create-pin');
  var CreatePinView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle(this.gettext('Create Pin'));
      this.renderTemplate('create-pin.html');
      pin.init();
      return this;
    }
  });
  // Our module now returns our view
  return CreatePinView;
});
