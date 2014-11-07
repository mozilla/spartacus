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
      utils.trackEvent({'action': 'wait-to-finish',
                        'label': 'Completing Payment'});

      var statusCompleted = utils.bodyData.transStatusCompleted;
      if (typeof statusCompleted !== 'undefined') {
        wait.startWaiting(statusCompleted);
      } else {
        return app.error.render({errorCode: 'STATUS_COMPLETE_UNDEF'});
      }
      return this;
    }

  });

  return WaitToFinishView;
});
