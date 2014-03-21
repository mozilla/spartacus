define([
  'lib/pin',
  'log',
  'views/base',
  'views/throbber'
], function(pin, log, BaseView, throbber){
  var console = log('view', 'enter-pin');
  var EnterPinView = BaseView.extend({
    render: function(){
      console.log('rendering...');
      this.setTitle(this.gettext('Enter Pin'));
      this.renderTemplate('enter-pin.html');
      pin.init();
      throbber.hide();
      return this;
    }
  });
  // Our module now returns our view
  return EnterPinView;
});
