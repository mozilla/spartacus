define([
  'auth',
  'backbone',
  'cancel',
  'i18n',
  'jquery',
  'log',
  'models/pin',
  'models/session',
  'models/transaction',
  'router',
  'settings',
  'underscore',
  'utils',
  'views/throbber',
  'views/error'
], function(auth, Backbone, cancel, i18n, $, log, PinModel, SessionModel, TransactionModel, AppRouter, settings, _, utils, ThrobberView, ErrorView) {

  'use strict';

  var console = log('view', 'app');

  // This object manages pageView transitions.
  var ViewManager = function(){
    this.currentView = null;

    this.renderView = function(ViewClass, options) {
      options = options || {};
      if (this.currentView){
        console.log('Killing previous view instance.');
        this.currentView.close();
      }
      var view = new ViewClass(options);
      this.currentView = view;
      view.render();
    };
  };


  var AppView = Backbone.View.extend({

    initialize: function() {
      console.log('I AM SPARTACUS!');
      console.log('Initing app view');

      // Create Model Instances.
      this.session = new SessionModel();
      this.pin = new PinModel();
      this.transaction = new TransactionModel();

      // Create overlaid view instances.
      this.throbber = new ThrobberView();
      this.error = new ErrorView();

      // Create the router instance and fire-up history.
      this.router = new AppRouter({ViewManager: ViewManager, app: this});


      return this;
    },

    start: function() {
      i18n.initLocale(_.bind(function(){
        // Start history with silent=true to not render an initial view as we're going to take care of that.
        console.log('Starting Backbone.history');
        Backbone.history.start({pushState: true, root: this.router.root, silent: true});
        this.router.showInit();
      }, this));
    },

  });

  return AppView;
});
