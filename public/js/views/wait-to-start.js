define([
  'log',
  'utils',
  'views/page',
  'wait'
], function(log, utils, PageView, wait) {

  'use strict';

  var WaitToStartView = PageView.extend({

    render: function(){
      app.throbber.render(this.gettext('Setting up payment'));

      var statusPending = utils.bodyData.transStatusPending;

      if (typeof statusPending !== 'undefined') {
        wait.startWaiting(statusPending);
      } else {
        app.error.render({
          context: {
            errorCode: 'STATUS_PENDING_UNDEF',
            msg: this.gettext('Pending status has not been set as a data attr. Aborting.')
          },
        });
      }
      return this;
    }

  });

  return WaitToStartView;
});
