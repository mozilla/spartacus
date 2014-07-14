define(['jquery', 'log', 'underscore', 'utils'], function($, log, _, utils) {

  'use strict';

  var console = log('provider');

  // Base Provider
  function Provider(options){
    options = options || {};
    this.storage = options.storage || window.localStorage;
  }

  Provider.prototype = {

    simChanged: function() {
      var changed = false;
      var iccKey;
      var lastIcc;
      // Compare the last used SIM(s) to the current SIM(s).

      // TODO: Bug 942361 implement algorithm proposed at
      // https://wiki.mozilla.org/WebAPI/WebPayment/Multi-SIM#Firefox_OS_v1.4

      // Since Firefox OS 1.4 the mozPaymentProvider API does not include
      // separated properties for the ICC ID, MCC and MNC values anymore,
      // but an 'iccInfo' object containing these values and extra
      // information that allows the payment provider to deliver an
      // improved logic for the multi-SIM scenario.
      if (utils.mozPaymentProvider.iccInfo) {
        // Firefox OS version >= 1.4
        // Until Bug 942361 is done, we just take the iccInfo of the
        // first SIM.
        var paymentServiceId = '0';
        if (utils.mozPaymentProvider.iccInfo[paymentServiceId]) {
          iccKey = utils.mozPaymentProvider.iccInfo[paymentServiceId].iccId;
        }
      } else if (utils.mozPaymentProvider.iccIds) {
        // Firefox OS version < 1.4
        iccKey = utils.mozPaymentProvider.iccIds.join(';');
      }

      if (iccKey) {
        lastIcc = this.storage.getItem('spa-last-icc');
        this.storage.setItem('spa-last-icc', iccKey);
        if (lastIcc && lastIcc !== iccKey) {
          console.log('new icc', iccKey, '!== saved icc', lastIcc);
          changed = true;
          console.log('sim changed');
          utils.trackEvent({'action': 'sim change detection',
                            'label': 'Sim Changed'});
        } else {
          console.log('sim did not change');
        }
      } else {
        console.log('iccKey unavailable');
      }

      return changed;
    },

    prepareSim: function() {
      if (this.simChanged()) {
        // Log out if a new SIM is used.
        return this.logout();
      } else {
        // Nothing to do so return a resolved deferred.
        return $.Deferred().resolve();
      }
    },

    prepareAll: function(userHash) {

      if (!userHash) {
        app.error.render({errorCode: 'USER_HASH_EMPTY'});
        return $.Deferred().reject();
      }

      var existingUser = this.storage.getItem('spa-user-hash');
      this.storage.setItem('spa-user-hash', userHash);

      console.log('new user hash =', userHash,
                  'existing user hash =', existingUser);

      if (existingUser && existingUser !== userHash) {
        console.log('User has changed: do logout');
        utils.trackEvent({'action': 'user change detection',
                          'label': 'User Changed'});
        return this.logout();
      } else {
        console.log('User unchanged based on stored hash');
        return this.prepareSim();
      }
    },

    logout: function() {
      console.log('logout called (no-op)');
      return $.Deferred().resolve();
    },
  };


  function Bango(options) {
    Provider.call(this, options);
  }

  // Bango specifics.
  Bango.prototype = Object.create(Provider.prototype);
  Bango.prototype.logout = function() {

    // Log out of Bango so that cookies are cleared.
    var url = utils.bodyData.bangoLogoutUrl;
    console.log('Logging out of Bango at', url);
    if (url) {
      var req = $.ajax({url: url, dataType: 'script'});

      req.done(function(data, textStatus, $xhr) {
        console.log('Bango logout responded: ' + $xhr.status);
        utils.trackEvent({'action': 'provider logout',
                          'label': 'Bango Logout Success'});
      });

      req.fail(function($xhr, textStatus, errorThrown) {
        console.error('Bango logout failed with status=' + $xhr.status +
                      ' ; resp=' + textStatus + '; error=' + errorThrown);
        utils.trackEvent({'action': 'provider logout',
                          'label': 'Bango Logout Failure'});
      });

      return req;
    } else {
      console.error('Bango logout url missing');
      app.error.render({errorCode: 'LOGOUT_URL_MISSING'});
      return $.Deferred().reject();
    }
  };


  function providerFactory(provider, options) {
    if (provider === 'bango') {
      return new Bango(options);
    } else {
      return new Provider(options);
    }
  }

  return {
    providerFactory: providerFactory,
    Provider: Provider,
    Bango: Bango
  };

});
