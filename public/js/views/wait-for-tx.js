define([
  'log',
  'views/base'
], function(log, BaseView) {

  'use strict';

  var WaitView = BaseView.extend({
    render: function(){
      app.throbber.render(this.gettext('Starting Payment'));
      return this;
    }
  });

  return WaitView;
});
