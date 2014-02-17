define(['views/base', 'log'], function(BaseView, log){
  var console = log('view', 'throbber');
  var ThrobberView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle(this.gettext('Throbber'));
      this.renderTemplate('throbber.html', {msg: this.gettext('Loading...')});
      return this;
    }
  });
  // Our module now returns our view
  return ThrobberView;
});
