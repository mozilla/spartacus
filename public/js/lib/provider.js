define(['jquery', 'log'], function($, log) {

  var console = log('provider');

  var provider = {

    prepareSim: function() {
      console.log('Provider prepareSim currently noop');
    },

    prepareAll: function() {
      console.log('Provider prepareAll currently noop');
    },

    logout: function() {
      console.log('Provider logout currently noop');
      var def = $.Deferred();
      window.setTimeout(function() {
        def.resolve();
      }, 500);
      return def;
    },
  };

  return provider;

});
