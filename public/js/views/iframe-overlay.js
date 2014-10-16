// A specialised subView for creating an error page overlay
// That sits in it's own container.
define([
  'cancel',
  'log',
  'views/base'
], function(cancel, log, BaseView){

  'use strict';

  var logger = log('views', 'iframe-overlay');

  var IframeOverlayView = BaseView.extend({

    el: '#overlay',

    events: {
      'click .button.cta': 'onCloseOverlay',
    },

    onCloseOverlay: function(e) {
      e.preventDefault();
      this.close();
    },

    render: function(options){

      this.$el.empty();
      this.delegateEvents(this.events);

      var iframeSrc = options.iframeSrc;

      var context = {
        iframeSrc: iframeSrc,
      };

      // Make it so!
      logger.log('Rendering Iframe Overlay template');
      this.renderTemplate('iframe-overlay.html', context);
      logger.log('Toggling redraw class');
      this.$el.toggleClass('redraw');
    }

  });

  return IframeOverlayView;
});
