define([
  'backbone',
  'cancel',
  'jquery',
  'log',
  'views/base'
], function(Backbone, cancel, $, log, BaseView){

  'use strict';

  var console = log('view', 'locked');

  var LockedView = BaseView.extend({

    render: function(){
      console.log('Locked! Buy your way out with a crystal.');
      this.clear();

      // The locked view is just a specialized error message.
      app.error.render({
        context: {
          'pageclass': 'full-error locked',
          'heading': this.gettext('Error'),
          'msg': this.gettext('You entered the wrong PIN too many times. Your account is locked. Please try your purchase again in 5 minutes.'),
          'errorCode': 'PIN_LOCKED',
        }
      });

      return this;
    }

  });

  return LockedView;
});
