define([
  'jquery',
  'log',
  'views/page'
], function($, log, PageView){

  'use strict';

  var logger = log('views', 'super-simulate');

  var SuperSimulateView = PageView.extend({

    events: {
      'click .cta': 'handleSubmit',
    },

    handleSubmit: function(e) {
      if (e) {
        e.preventDefault();
      }
      app.throbber.render();

      // Warning: nothing that a user with super power does here is
      // validated on the server. To allow a super user to do something
      // sensitive on the server, be sure the backend validates their super powers
      // session credential.

      var networkCodes;
      var networkSim = $('#network-simulation option:selected').val();
      if (networkSim) {
        var codes = networkSim.split(':');
        networkCodes = {
          mcc: codes[0],
          mnc: codes[1],
        };
      }
      logger.log('network simulation:', networkCodes);
      this.setUpPayment({networkCodes: networkCodes});
    },

    render: function(){
      var context = {};
      this.renderTemplate('super-simulate.html', context);
      this.setTitle(this.gettext('Super Simulate'));
      app.throbber.close();
      return this;
    }

  });

  return SuperSimulateView;
});
