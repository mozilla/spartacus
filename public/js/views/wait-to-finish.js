define([
  'log',
  'utils',
  'views/page',
  'wait'
], function(log, utils, PageView, wait) {

  'use strict';

  // This view is called on return from the payment provider.
  var WaitToFinishView = PageView.extend({

    render: function(){
      app.throbber.render(this.gettext('Completing payment'));
      var statusCompleted = utils.bodyData.transStatusCompleted;
      if (typeof statusCompleted !== 'undefined') {
        wait.startWaiting(statusCompleted);
      } else {
        app.error.render({
          context: {
            errorCode: 'STATUS_COMPLETE_UNDEF',
            msg: this.gettext('Complete status has not been set as a data attr. Aborting.')
          },
        });
      }
      return this;
    }

  });

  return WaitToFinishView;
});
