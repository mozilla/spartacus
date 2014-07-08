// Default Context for styleguide pages.

module.exports = {
  error: {
    pageclass: 'full-error',
    heading: "Error Heading",
    msg: "An error message telling the user what happened",
    errorCode: "ERROR_CODE",
    showCta: true,
  },
  throbber: {
    msg: "Loading",
  },
  pinForm: {
    pinTitle: "Create Pin",
    ctaText: "Continue"
  },
  locked: {
    pageclass: 'full-error locked',
    heading: 'Pin Locked',
    msg: 'You entered the wrong PIN too many times. Your account is locked. Please try your purchase again in 5 minutes.',
    showCancel: true,
    cancelText: 'OK'
  }

};
