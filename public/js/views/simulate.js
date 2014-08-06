define([
  'cancel',
  'log',
  'underscore',
  'utils',
  'views/page'
], function(cancel, log, _, utils, PageView){

  'use strict';

  var console = log('view', 'simulate');
  var SimulateView = PageView.extend({

    events: {
      'click .cancel': cancel.callPayFailure,
      'click .cta': 'handleSubmit',
    },

    handleSubmit: function(e) {
      if (e) {
        e.preventDefault();
      }
      app.throbber.render(this.gettext('Processing'));
      console.log('starting simulation');
      app.simulate.begin().done(function() {
        utils.trackEvent({action: 'simulate-success',
                          label: 'Successful simulated payment'});
        console.log('start simulation succeeded');
        utils.mozPaymentProvider.paymentSuccess();
      }).fail(function($xhr, textStatus) {
        console.error('simulated payment failed');
        console.error('XHR status', $xhr.status);
        console.error('response status', textStatus);

        var errorCode;
        if (textStatus === 'timeout') {
          utils.trackEvent({action: 'simulate-timeout',
                            label: 'Simulated payment timed out'});
          errorCode = 'SIMULATE_TIMEOUT';
        } else {
          utils.trackEvent({action: 'simulate-fail',
                            label: 'Simulated payment failed'});
          errorCode = 'SIMULATE_FAIL';
        }
        return app.error.render({errorCode: errorCode});
      });
    },

    render: function() {
      // TODO: make this page not require a login. bug 1050591.
      var title = this.gettext('Simulate Payment');
      this.setTitle(title);
      this.renderTemplate('simulate.html', {
        heading: title,
        msg: this.gettext('You will not be charged.'),
        simulateResult: JSON.stringify(app.session.get('simulate_result'))
      });
      app.throbber.close();
      return this;
    }

  });

  return SimulateView;
});
