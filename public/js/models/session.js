define([
  'backbone',
  'cancel',
  'id',
  'log'
], function(Backbone, cancel, id, log){

  var console = log('model', 'session');

  var SessionModel = Backbone.Model.extend({

    defaults: {
      logged_in: null
    },

    initialize: function() {
      console.log('session model inited');
    },

    watchIdentity: function(options) {
      var that = this;

      options = options || {};

      var forceAuth = options.forceAuth || false;
      console.log('forceAuth is ', forceAuth);

      id.watch({
        onlogin: function(assertion){
          if (!forceAuth) {
            console.log('Firing onlogin event');
            that.trigger('onlogin', assertion);
          } else {
            // Allow special handling of login following
            // a re-auth.
            console.log('Firing onlogin (forceAuth) event');
            that.trigger('onlogin-force-auth', assertion);
          }
        },
        onlogout: function() {
          console.log('Firing onlogout event');
          that.trigger('onlogout');
        },
        onready: function() {
          console.log('Firing onready event');
          that.trigger('onready');
        },
        oncancel: function() {
          console.log('Firing oncancel event');
          that.trigger('oncancel');
        },
      });
    },

  });

  return SessionModel;
});
