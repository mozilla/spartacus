/* global $ */
(function(){
  var $resizable = $('.resizable');
  var $panel = $resizable.closest('.panel');
  var $size = $panel.find('.size');

  var $fullscreen = $panel.find('.full-screen');
  var $trustedui = $panel.find('.trusted-ui-size');
  var $androidui = $panel.find('.android-ui-size');

  var resizePadding = 10;
  var vp = {
    androidui: {
      w: 350,
      h: 598,
    },
    trustedui: {
      w: 276,
      h: 345,
    }
  };

  function handleActive($elm, type) {
    var w = $resizable.width();
    var h = $resizable.height();
    var vpHeight = vp[type].h;
    var vpWidth = vp[type].w;
    if (w !== vpWidth || h !== vpHeight) {
      $elm.removeClass('active');
    } else if (w === vpWidth && h === vpHeight) {
      $elm.addClass('active');
    }
  }

  function updateDimensions() {
    var w = $resizable.width();
    var h = $resizable.height();
    $size.text('@ ' + w + ' x ' + h);
    handleActive($trustedui, 'trustedui');
    handleActive($androidui, 'androidui');
  }

  var watch = new MutationObserver(function(){
    updateDimensions();
  });

  function  handleClick(type) {
    var vpHeight = vp[type].h + resizePadding;
    var vpWidth = vp[type].w + resizePadding;
    $resizable.css({width: vpWidth, height: vpHeight});
    updateDimensions();
  }

  function launchFullscreen(element) {
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  $fullscreen.on('click', function() {
    launchFullscreen($resizable[0]);
  });

  $trustedui.on('click', function() {
    handleClick('trustedui');
  });

  $androidui.on('click', function() {
    handleClick('androidui');
  });

  if ($resizable.length) {
    // Currently this won't work on webkit. :(
    // See https://code.google.com/p/chromium/issues/detail?id=293948
    watch.observe($resizable[0],{attributes:true}) ;
  }
})();


