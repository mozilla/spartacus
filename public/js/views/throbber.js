define(['views/base', 'gettext', 'log'], function(BaseView, gettext, log){
  var console = log('view', 'throbber');
  var gt = gettext.gettext;
  var ThrobberView = BaseView.extend({
    render: function(){
      console.log('rendering view');
      this.setTitle('Was Locked');
      this.renderTemplate('throbber.html', {msg: gt('Loading...')});
      return this;
    }
  });
  // Our module now returns our view
  return ThrobberView;
});
