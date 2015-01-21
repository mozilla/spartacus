define([
  'backbone',
  'log',
  'underscore',
  'utils',
  'query-string' // must be last.
], function(Backbone, log, _, utils){

  var logger = log('models', 'transaction');
  var netCodeRX = /^[0-9]{2,3}$/;

  var TransactionModel = Backbone.Model.extend({

    url: utils.apiUrl('pay'),

    defaults: {
      jwt: null,
      provider: null
    },

    initialize: function() {
      logger.log('Transaction model inited');
    },

    startTransaction: function(overrides) {
      overrides = overrides || {};
      var options = {};
      var networkCodes = this.getNetworkCodes();
      if (overrides.networkCodes) {
        logger.warn('overriding network codes', JSON.stringify(networkCodes),
                    'with:', JSON.stringify(overrides.networkCodes));
        networkCodes = overrides.networkCodes;
      } else {
        logger.log('not applying any overrides');
      }

      options.data = {
        req: this.jwt(),
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

    saveJWT: function() {
      try {
        if (this.get('jwt')) {
          logger.log('Saving JWT to sessionStorage');
          sessionStorage.setItem('spa-jwt', this.get('jwt'));
        }
      } catch (e) {
        logger.error('Could not save JWT to sessionStorage', e);
      }
    },

    savedJWT: function() {
      try {
        logger.log('Retrieving JWT from sessionStorage');
        return sessionStorage.getItem('spa-jwt');
      } catch (e) {
        logger.error('Could not retrieve JWT from sessionStorage', e);
      }
    },

    clearSavedJWT: function() {
      try {
        logger.log('Removing JWT from sessionStorage');
        return sessionStorage.removeItem('spa-jwt');
      } catch (e) {
        logger.error('Could not remove JWT from sessionStorage', e);
      }
    },

    jwt: function() {
      if (this.savedJWT()) {
        if (!this.get('jwt')) {
          this.set('jwt', this.savedJWT());
        }
        this.clearSavedJWT();
      }
      return this.get('jwt');
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
        logger.log('mcc: ' + mpp.mcc);
        mnc = mpp.mnc[0];
        logger.log('mnc: ' + mpp.mnc);
      // 1.4+ multi-sim support
      } else if (mpp.iccInfo) {
        logger.log('Using B2G 1.4+ mcc/mnc lookup');
        var values = _.values(mpp.iccInfo);
        for (var i=0, j=values.length; i<j; i++) {
          if (values[i].dataPrimary === true) {
            mcc = values[i].mcc;
            mnc = values[i].mnc;
          }
        }
      } else {
        logger.log('mnc/mcc not available');
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
