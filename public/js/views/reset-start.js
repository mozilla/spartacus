define([
  'log',
  'views/base',
], function(log, BaseView){

  'use strict';

  var console = log('view', 'reset-start');

  var ResetStartView = BaseView.extend({

    events: {
      'click .back': 'handleBack',
      'click .cta:enabled': 'handleResetStart',
    },

    handleBack: function(e) {
      e.preventDefault();
      app.router.navigate('enter-pin', {trigger: true});
    },

    handleResetStart: function(e) {
      e.preventDefault();
      console.log('noop start reset');
    },

    render: function(){
      console.log('rendering reset-start view');
      this.setTitle(this.gettext('Reset your PIN?'));
      this.renderTemplate('reset-start.html');
      app.throbber.hide();
      return this;
    }

  });

  return ResetStartView;
});
