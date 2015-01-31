define([
  'jquery',
  'log',
  'views/page'
], function($, log, PageView){

  'use strict';

  var logger = log('views', 'super-simulate');

  var SuperSimulateView = PageView.extend({

    simNetworkKey: 'spaSimNetwork',  // key for local storage

    events: {
      'click .cta': 'onSubmit',
      'change #network-simulation': 'onChangeNetwork',
    },

    onChangeNetwork: function(e) {
      var val = $(e.currentTarget).val();
      window.localStorage.setItem(this.simNetworkKey, val);
      logger.log('Saving simulated network selection:', val);
    },

    onRenderNetworkSelect: function() {
      var val = window.localStorage.getItem(this.simNetworkKey);
      logger.log('Network select has been rendered. Restoring value:', val);
      if (!val) {
        return;
      }
      $('#network-simulation option').prop('selected', false);
      $('#network-simulation option[value="' + val + '"]').prop('selected', true);
    },

    onSubmit: function(e) {
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
      this.onRenderNetworkSelect();
      this.setTitle(this.gettext('Super Simulate'));
      app.throbber.close();
      return this;
    }

  });

  return SuperSimulateView;
});
