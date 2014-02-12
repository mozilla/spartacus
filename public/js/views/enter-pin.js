define(['views/base', 'log'], function(BaseView, log){
  var console = log('view', 'enter-pin');
  var EnterPinView = BaseView.extend({
    render: function(){
      console.log('rendering...');
      this.setTitle('Enter Pin');
      this.renderTemplate('enter-pin.html');
      return this;
    }
  });
  // Our module now returns our view
  return EnterPinView;
});
