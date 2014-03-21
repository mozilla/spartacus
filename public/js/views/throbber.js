define(['jquery', 'views/base', 'log'], function($, BaseView, log){

  var console = log('view', 'throbber');
  var ThrobberView = BaseView.extend({
    el: '#progress',
    $el: $('#progress'),
    render: function(msg){
      console.log('rendering throbber');
      this.setTitle(msg || this.gettext('Loading...'));
      this.renderTemplate('throbber.html', {msg: msg || this.gettext('Loading...')});
      return this;
    },
  });

  var throbberView = new ThrobberView();

  return {
    show: function _show(msg) {
      console.log('Showing progress');
      throbberView.render(msg);
    },
    hide: function _hide() {
      console.log('Hiding progress');
      throbberView.clear();
    },
  };
});
