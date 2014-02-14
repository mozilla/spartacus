define(['jquery', 'log'], function($, log) {

  var console = log('pin');
  var pinMaxLength = 4;
  var pinBuffer;

  var numericRx = /^\d$/;

  // Placeholders for jQuery elements.
  var $pinBox;
  var $pseudoInputs;
  var $pinInput;
  var $submitButton;

  function focusPin() {
    console.log('Focusing pin');
    pinBuffer = '';
    updatePinUI();
    $pinInput.focus();
  }

  function updatePinUI() {
    console.log('Updating pin UI');
    var numFilled = pinBuffer.length;
    $pseudoInputs.each(function(index, elm) {
      var $elm = $(elm);
      if (index + 1 <= numFilled) {
        $elm.addClass('filled');
      } else {
        $elm.removeClass('filled');
      }
    });

    $submitButton.prop('disabled', (pinBuffer.length !== pinMaxLength));
  }

  function handleKeyPress(e) {
    var key = String.fromCharCode(e.charCode);
    // Check if [0-9]
    if (numericRx.test(key) && pinBuffer.length !== pinMaxLength) {
      console.log('Adding to buffer');
      pinBuffer += key;
    // OR if this is a backspace.
    } else if (e.keyCode === 8 && pinBuffer.length > 0) {
      console.log('Removing from buffer');
      pinBuffer = pinBuffer.slice(0, -1);
    }

    updatePinUI();
    // We don't need to fill up the input at all :).
    return false;
  }

  function init() {
    $pinBox = $('.pinbox');
    $pseudoInputs = $('.pinbox span');
    $pinInput = $('#pin');
    $submitButton = $('button.continue');

    $pinBox.on('click', function(e) {
      focusPin();
      e.preventDefault();
    });
    $pinInput.on('keypress', handleKeyPress);
    focusPin();
  }

  return {
    init: init
  };

});
