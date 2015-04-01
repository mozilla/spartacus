/*
 * Note: Error messages placed here should only be user-facing messages.
 * All other technical information should be added to the dev_messages API in webapy.
 */
define([
  'i18n-abide-utils',
], function(i18n) {

  var gettext = i18n.gettext;

  return {
    BUYER_NOT_CONFIGURED: gettext('Product cannot be purchased due to configuration error.'),
    INTERNAL_TIMEOUT: gettext('An internal web request timed out.'),
    LOGIN_TIMEOUT: gettext('The system timed out while trying to log in.'),
    LOGOUT_ERROR: gettext('An error occurred whilst trying to log out.'),
    LOGOUT_TIMEOUT: gettext('The system timed out while trying to log out.'),
    NO_PUBLICID_IN_JWT: gettext('Product cannot be purchased due to configuration error.'),
    NO_VALID_SELLER: gettext('Product cannot be purchased due to configuration error.'),
    PAY_DISABLED: gettext('Payments are temporarily disabled.'),
    PIN_CREATE_ERROR: gettext('An unexpected error occurred when creating your PIN.'),
    PIN_CREATE_INVALID: gettext('The PIN data submitted was invalid.'),
    PIN_CREATE_NO_USER: gettext('No valid user found whilst attempting to create your PIN'),
    PIN_CREATE_PERM_DENIED: gettext('Permission denied attempting to create your PIN.'),
    PIN_CREATE_TIMEOUT: gettext('The request timed out whilst attempting to create your PIN.'),
    PIN_ENTER_ERROR: gettext('An unexpected error occurred whilst checking your PIN.'),
    PIN_ENTER_NO_USER: gettext('No valid user found whilst checking your PIN'),
    PIN_ENTER_PERM_DENIED: gettext('Permission denied attempting to check your PIN'),
    PIN_ENTER_TIMEOUT: gettext('The request timed out whilst trying to check your PIN'),
    PIN_RESET_ERROR: gettext('An unexpected error occurred when resetting your PIN.'),
    PIN_RESET_INVALID: gettext('The PIN data submitted was invalid.'),
    PIN_RESET_NO_USER: gettext('No valid user found whilst attempting to reset your PIN'),
    PIN_RESET_PERM_DENIED: gettext('Permission denied attempting to reset your PIN.'),
    PIN_RESET_TIMEOUT: gettext('The request timed out whilst attempting to reset your PIN.'),
    SELLER_NOT_CONFIGURED: gettext('Product cannot be purchased due to configuration error.'),
    TRANS_FAILED: gettext('The transaction failed. You have not been charged for this purchase.'),
    UNSUPPORTED_PAY: gettext('The payment method or price point is not supported for this region or operator.'),
  };

});

