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

    watchIdentity: function() {
      var that = this;

      id.watch({
        onlogin: function(assertion){
          console.log('Firing onlogin event');
          that.trigger('onlogin', assertion);
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
