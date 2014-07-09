/*
 * Note: Error messages placed here sholuld only be user-facing messages.
 * All other technical information should be added to the dev_messages API in webapy.
 */
define([
  'i18n-abide-utils',
], function(i18n) {

  var gettext = i18n.gettext;

  return {
    INTERNAL_TIMEOUT: gettext('An internal web request timed out.'),
    LOGIN_TIMEOUT: gettext('The system timed out while trying to log in.'),
    LOGOUT_ERROR: gettext('An error occurred whilst trying to log out.'),
    LOGOUT_TIMEOUT: gettext('The system timed out while trying to log out.'),
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
    PIN_STATE_ERROR: gettext('An unexpected error occurred whilst fetching data.'),
    PIN_STATE_TIMEOUT: gettext('The request timed out fetching data.'),
    REAUTH_LOGOUT_ERROR: gettext('An error occurred whilst trying to log out.'),
    REVERIFY_DENIED: gettext('Permission denied re-verifying the user.'),
    REVERIFY_FAILED: gettext('Re-verifying the user failed.'),
    REVERIFY_MISSING_PROVIDER: gettext('The provider did not exist'),
    REVERIFY_MISSING_URL: gettext('The re-verification url is not configured.'),
    REVERIFY_TIMEOUT: gettext('The request to the server timed out during re-verification.'),
    TRANS_FAILED: gettext('The transaction failed. You have not been charged for this purchase.'),
    TRANS_TIMEOUT: gettext('The system timed out while waiting for a transaction.'),
    UNEXPECTED_ERROR: gettext('An unexpected error occurred.'),
    UNEXPECTED_STATE: gettext('An unexpected error occurred.'),
    UNSUPPORTED_PAY: gettext('The payment method or price point is not supported for this region or operator.'),
    USER_CANCELLED: gettext('The user cancelled the payment.'),
  };

});

