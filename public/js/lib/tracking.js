define(['caps', 'log', 'settings'], function(caps, log, settings) {

  var clientID;
  var console = log('tracking');
  var enabled = settings.ua_tracking_enabled;
  var actionsEnabled = settings.ua_action_tracking_enabled;

  // Respect DNT.
  var shouldNotTrack = {'yes': 1, '1': 1};
  if (enabled && !settings.ua_dnt_override &&
    (navigator.doNotTrack in shouldNotTrack ||
     navigator.msDoNotTrack in shouldNotTrack)) {
    console.log('[tracking] DNT enabled; disabling tracking');
    enabled = false;
  }

  if (caps.hasLocalStorage) {
    clientID = window.localStorage.getItem('clientID');
    if (!clientID && enabled) {
      clientID = (Date.now() + Math.random()).toString(36);
      window.localStorage.setItem('clientID', clientID);
    }
  }

  if (!enabled) {
    console.log('[tracking] Tracking disabled, aborting init');
    return {
      enabled: false,
      actionsEnabled: false,
      setVar: function() {},
      trackEvent: function() {}
    };
  }

  function setupUATracking(id, initialUrl) {
    window.GoogleAnalyticsObject = 'ga';
    window.ga = window.ga || function() {
      (window.ga.q = window.ga.q || []).push(arguments);
    };
    window.ga.l = 1 * new Date();

    var ua = document.createElement('script');
    ua.type = 'text/javascript';
    ua.async = true;
    ua.src = 'https://www.google-analytics.com/analytics.js';
    document.body.appendChild(ua);

    // In fireplace we set our own clientId.
    // In Spartacus we will attempt to use the same clientId.
    // However, if it's not accessible we'll fall-back to
    // Letting analytics.js persist a Unique client id.
    var opts = {};
    if (clientID) {
      opts.storage = 'none';
      opts.clientId = clientID;
    }
    window.ga('create', id, opts);
    window.ga('set', 'checkProtocolTask', function(){});
    window.ga('send', 'pageview', initialUrl);
  }

  function uaPush() {
    window.ga.apply(this, Array.prototype.slice.call(arguments, 0));
  }

  function getURL() {
    return window.location.pathname + window.location.search;
  }

  function actionWrap(func) {
    if (!actionsEnabled) {
      return function() {};
    }
    return func;
  }

  if (settings.ua_tracking_id) {
    console.log('[tracking] Setting up GA tracking');
    setupUATracking(settings.ua_tracking_id, getURL());
  }

  console.log('Tracking initialized');

  return {
    enabled: true,
    actionsEnabled: actionsEnabled,
    setVar: actionWrap(function(index, name, value) {
      uaPush('set', 'dimension' + index, value);
    }),
    trackEvent: actionWrap(function() {
      var args = Array.prototype.slice.call(arguments, 0);
      uaPush.apply(this, ['send', 'event'].concat(args));
    })
  };

});
