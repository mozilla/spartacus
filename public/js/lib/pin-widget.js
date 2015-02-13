define([
  'caps',
  'i18n-abide-utils',
  'jquery',
  'log',
  'utils'
], function(caps, i18n, $, log, utils) {

  'use strict';

  var backspace = 8;
  var enterKeyCode = 13;

  var logger = log('lib', 'pin-widget');
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
  var $pinBox;


  function getPin() {
    return pinBuffer;
  }

  function focusPin() {
    // In the trusted UI we need to ensure it has
    // focus otherwise programmatic focus doesn't work.
    logger.log('Focusing window');
    window.focus();
    updatePinUI();
    logger.log('Focusing pin');
    $pinInput.focus();
  }

  function updatePinUI() {
    logger.log('Updating pin UI');
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

  function isModifierKey(e) {
    return e.altKey || e.metaKey || e.ctrlKey;
  }

  function handleKeyPress(e) {
    var key = String.fromCharCode(e.charCode);
    var keyCode = e.keyCode;

    // Show an error if enter is used to submit when the number of chars
    // is less that pinMaxLength
    if (keyCode === enterKeyCode && pinBuffer.length !== pinMaxLength) {
      utils.trackEvent({'action': 'pin form',
                        'label': 'Pin Error Displayed'});
      showError(i18n.gettext('PIN too short'), {showForgotPin: true});
      return false;
    }

    // Don't prevent non-char keys save for backspace which we handle
    // specially.
    // This allows things like cmd+r / tab / shift + tab etc.
    // It also allows enter to submit the PIN.
    if (isModifierKey(e) || (e.charCode === 0 && keyCode !== backspace)) {
      return true;
    }
    // Check if [0-9]
    if (numericRx.test(key) && pinBuffer.length !== pinMaxLength) {
      pinBuffer += key;
    // OR if this is a backspace.
    } else if (keyCode === backspace && pinBuffer.length > 0) {
      pinBuffer = pinBuffer.slice(0, -1);
    // If not a number or backspace and we still don't have the whole pin
    // show a message to indicate to the user that the input is incorrect.
    } else if (pinBuffer.length !== pinMaxLength && keyCode !== backspace) {
      utils.trackEvent({'action': 'pin form',
                        'label': 'Pin Error Displayed'});
      showError(i18n.gettext('PIN can only contain digits.'));
      return false;
    }
    hideError();
    updatePinUI();
    // We don't need to fill up the input at all :).
    return false;
  }

  function showError(errorMessage, options) {
    options = options || {showForgotPin: false};
    logger.log('Show error message: ' + errorMessage);
    $errorMessage.text(errorMessage);
    $errorMessage.removeClass('hidden');
    if (!options.showForgotPin) {
      // Forgot PIN is only shown on the Enter PIN page.
      $forgotPin.addClass('hidden');
    }
    // Terms are only used on the Create PIN page.
    $terms.addClass('hidden');
    focusPin();
  }

  function hideError() {
    logger.log('hiding error messages.');
    $errorMessage.addClass('hidden');
    // Forgot PIN is only shown on the Enter PIN page.
    $forgotPin.removeClass('hidden');
    // Terms are only used on the Create PIN page.
    $terms.removeClass('hidden');
  }

  function init() {
    logger.log('Initing pin widget');
    $pseudoInputs = $('.pinbox span');
    $pinInput = $('#pin');
    $pinBox = $('.pinbox');
    $submitButton = $('.cta[type=submit]');
    $errorMessage = $('.err-msg');
    $forgotPin = $('.forgot-pin');
    $terms = $('.terms');
    $content = $('.content');

    $pinInput.on('focus', function() {
      $pinBox.addClass('focused');
    });

    $pinInput.on('blur', function() {
      $pinBox.removeClass('focused');
    });

    $content.on('click', function(e) {
      var targetNodeName;
      if (e.target) {
        targetNodeName = e.target.nodeName.toLowerCase();
      }
      // Filter out links and buttons as a workaround to bug 1065563.
      if (['a','button'].indexOf(targetNodeName) === -1) {
        focusPin();
        e.preventDefault();
      }
    });
    $pinInput.on('keypress', handleKeyPress);
    focusPin();
  }

  function resetPinUI() {
    logger.log('Reset pin UI');
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
