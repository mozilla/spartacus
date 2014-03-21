define([
  'lib/pin',
  'log',
  'views/base',
  'views/throbber'
], function(pin, log, BaseView, throbber){
  var console = log('view', 'create-pin');
  var CreatePinView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle(this.gettext('Create Pin'));
      this.renderTemplate('create-pin.html');
      pin.init();
      throbber.hide();
      return this;
    }
  });
  // Our module now returns our view
  return CreatePinView;
});
