define([
  'backbone',
  'log',
  'underscore',
  'utils',
  'query-string' // must be last.
], function(Backbone, log, _, utils){

  var console = log('model', 'transaction');
  var netCodeRX = /^[0-9]{2,3}$/;

  var TransactionModel = Backbone.Model.extend({

    url: utils.apiUrl('pay'),

    defaults: {
      jwt: null,
      provider: null
    },

    initialize: function() {
      console.log('Transaction model inited');
    },

    startTransaction: function(jwt) {
      var options = {};
      var networkCodes = this.getNetworkCodes();

      options.data = {
        req: jwt,
      };

      if (networkCodes.mcc && networkCodes.mnc) {
        options.data.mnc = networkCodes.mnc;
        options.data.mcc = networkCodes.mcc;
      }

      options.data = JSON.stringify(options.data);
      options.contentType = 'application/json';
      options.dataType = 'json';

      return this.sync('create', this,  options);
    },

    getNetworkCodes: function() {
      // Returns mcc/mnc if available.
      var mpp = utils.mozPaymentProvider;
      var networkCodes = {};
      var mcc;
      var mnc;

      // Pre 1.4
      if (mpp.mcc && mpp.mnc) {
        mcc = mpp.mcc[0];
        console.log('mcc: ' + mpp.mcc);
        mnc = mpp.mnc[0];
        console.log('mnc: ' + mpp.mnc);
      // 1.4+ multi-sim support
      } else if (mpp.iccInfo) {
        console.log('Using B2G 1.4+ mcc/mnc lookup');
        var values = _.values(mpp.iccInfo);
        for (var i=0, j=values.length; i<j; i++) {
          if (values[i].dataPrimary === true) {
            mcc = values[i].mcc;
            mnc = values[i].mnc;
          }
        }
      } else {
        console.log('mnc/mcc not available');
      }

      if (netCodeRX.test(mcc) && netCodeRX.test(mnc)) {
        networkCodes.mcc = mcc;
        networkCodes.mnc = mnc;
      }

      return networkCodes;
    }

  });

  return TransactionModel;
});
