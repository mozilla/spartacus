define(['views/base', 'log', 'lib/pin'], function(BaseView, log, pin){
  var console = log('view', 'enter-pin');
  var EnterPinView = BaseView.extend({
    render: function(){
      console.log('rendering...');
      this.setTitle(this.gettext('Enter Pin'));
      this.renderTemplate('enter-pin.html');
      pin.init();
      return this;
    }
  });
  // Our module now returns our view
  return EnterPinView;
});
