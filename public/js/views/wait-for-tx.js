define([
  'log',
  'views/base'
], function(log, BaseView) {

  'use strict';

  var WaitView = BaseView.extend({
    render: function(){
      app.throbber.render(this.gettext('Setting up payment&hellip;'));
      return this;
    }
  });

  return WaitView;
});
