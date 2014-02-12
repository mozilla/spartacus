define([
  'jquery',
  'underscore',
  'backbone',
  'views/login',
  'views/create-pin',
  'views/enter-pin',
  'views/reset-pin',
  'views/locked',
  'views/was-locked'
], function($, _, Backbone, LoginView, CreatePinView, EnterPinView, ResetPinView, LockedView, WasLockedView){

  var AppRouter = Backbone.Router.extend({
    routes: {
      'login': 'showLogin',
      'create-pin': 'showCreatePin',
      'enter-pin': 'showEnterPin',
      'reset-pin': 'showResetPin',
      'locked': 'showLocked',
      'was-locked': 'showWasLocked',

      // Default
      '*actions': 'defaultAction'
    },

    showLogin: function() {
      var loginView = new LoginView();
      loginView.render();
    },

    showCreatePin: function() {
      var createPinView = new CreatePinView();
      createPinView.render();
    },

    showEnterPin: function() {
      var enterPinView = new EnterPinView();
      enterPinView.render();
    },

    showResetPin: function() {
      var resetPinView = new ResetPinView();
      resetPinView.render();
    },

    showLocked: function() {
      var lockedView = new LockedView();
      lockedView.render();
    },

    showWasLocked: function() {
      var wasLockedView = new WasLockedView();
      wasLockedView.render();
    }

  });

  var initialize = function(){
    var appRouter = new AppRouter();
    appRouter.on('defaultAction', function(actions){
      // We have no matching route, lets just log what the URL was.
      console.log('No route:', actions);
    });
    Backbone.history.start({pushState: true});
  };
  return {
    initialize: initialize
  };
});
