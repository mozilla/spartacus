define([
  'i18n-abide-utils',
  'jquery',
  'log'
], function(i18n, $, log) {

  'use strict';

  var console = log('pin');
  var pinMaxLength = 4;
  var pinBuffer = '';

  var numericRx = /^\d$/;

  // Placeholders for jQuery elements.
  var $pseudoInputs;
  var $pinInput;
  var $submitButton;
  var $errorMessage;
  var $content;
  var $forgotPin;
  var $terms;

  function getPin() {
    return pinBuffer;
  }

  function focusPin() {
    // In the trusted UI we need to ensure it has
    // focus otherwise programmatic focus doesn't work.
    if (window.focus) {
      console.log('Focusing window');
      window.focus();
    }
    updatePinUI();
    console.log('Focusing pin');
    $pinInput.focus();
  }

  function updatePinUI() {
    console.log('Updating pin UI');
    var numFilled = pinBuffer.length;
    if (numFilled >= 1) {
      $terms.addClass('hidden');
    }
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
      pinBuffer += key;
    // OR if this is a backspace.
    } else if (e.keyCode === 8 && pinBuffer.length > 0) {
      pinBuffer = pinBuffer.slice(0, -1);
    // If not a number or backspace and we still don't have the whole pin
    // show a message to indicate to the user that the input is incorrect.
    } else if (pinBuffer.length !== pinMaxLength) {
      showError(i18n.gettext('PIN can only contain digits.'));
      return false;
    }
    hideError();
    updatePinUI();
    // We don't need to fill up the input at all :).
    return false;
  }

  function showError(errorMessage) {
    console.log('Show error message: ' + errorMessage);
    $errorMessage.text(errorMessage);
    $errorMessage.removeClass('hidden');
    $forgotPin.addClass('hidden');
    $terms.addClass('hidden');
    focusPin();
  }

  function hideError() {
    console.log('hiding error messages.');
    $errorMessage.addClass('hidden');
    $forgotPin.removeClass('hidden');
  }

  function init() {
    console.log('Initing pin widget');
    $pseudoInputs = $('.pinbox span');
    $pinInput = $('#pin');
    $submitButton = $('.cta[type=submit]');
    $errorMessage = $('.err-msg');
    $forgotPin = $('.forgot-pin');
    $terms = $('.terms');
    $content = $('.content');
    $content.on('click', function(e) {
      focusPin();
      e.preventDefault();
    });
    $pinInput.on('keypress', handleKeyPress);
    focusPin();
  }

  function resetPinUI() {
    console.log('Reset pin UI');
    pinBuffer = '';
    hideError();
    updatePinUI();
  }

  return {
    init: init,
    showError: showError,
    getPin: getPin,
    resetPinUI: resetPinUI,
    focusPin: focusPin,
  };

});
