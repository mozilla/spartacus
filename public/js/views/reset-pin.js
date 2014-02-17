define(['views/base', 'log', 'lib/pin'], function(BaseView, log, pin){
  var console = log('view', 'reset-pin');
  var ResetPinView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle(this.gettext('Reset Pin'));
      this.renderTemplate('reset-pin.html');
      pin.init();
      return this;
    }
  });
  // Our module now returns our view
  return ResetPinView;
});
