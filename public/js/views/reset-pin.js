define(['views/base', 'log'], function(BaseView, log){
  var console = log('view', 'reset-pin');
  var ResetPinView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle('Reset Pin');
      this.renderTemplate('reset-pin.html', {heading: 'Reset Pin'});
      return this;
    }
  });
  // Our module now returns our view
  return ResetPinView;
});
