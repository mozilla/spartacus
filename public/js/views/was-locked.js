define([
  'log',
  'views/base'
], function(log, BaseView){

  'use strict';

  var console = log('view', 'was-locked');
  var WasLockedView = BaseView.extend({
    render: function(){
      app.throbber.clear();
      console.log('rendering view');
      this.setTitle(this.gettext('Was Locked'));
      this.renderTemplate('was-locked.html');
      return this;
    }
  });
  // Our module now returns our view
  return WasLockedView;
});
