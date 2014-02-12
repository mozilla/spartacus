define(['views/base', 'log'], function(BaseView, log){
  var console = log('view', 'create-pin');
  var CreatePinView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle('Create Pin');
      this.renderTemplate('create-pin.html', {heading: 'Create Pin'});
      return this;
    }
  });
  // Our module now returns our view
  return CreatePinView;
});
