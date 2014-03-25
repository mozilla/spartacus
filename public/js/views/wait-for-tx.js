define([
  'log',
  'views/base',
  'views/throbber'
], function(log, BaseView, throbber){

  'use strict';

  var WaitView = BaseView.extend({
    render: function(){
      throbber.show(this.gettext('Starting Payment'));
      return this;
    }
  });
  // Our module now returns our view
  return WaitView;
});
