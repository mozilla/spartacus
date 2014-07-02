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
        return app.error.render({
          context: {
            errorCode: 'STATUS_PENDING_UNDEF',
          },
        });
      }
      return this;
    }

  });

  return WaitToStartView;
});
