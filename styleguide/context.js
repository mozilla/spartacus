// Default Context for styleguide pages.

module.exports = {
  error: {
    pageclass: 'full-error',
    heading: "Error Heading",
    msg: "An error message telling the user what happened",
    errorCode: "ERROR_CODE",
    cancelModifier: 'cancel cta',
    cancelText: 'Cancel',
    showCancel: true,
    showCta: false,
  },
  throbber: {
    msg: "Loading",
  },
  pinForm: {
    pinTitle: "Create PIN",
    ctaText: "Continue",
    showForgotPin: true,
  },
  locked: {
    pageclass: 'full-error locked',
    heading: 'Pin Locked',
    msg: 'You entered the wrong PIN too many times. Your account is locked. Please try your purchase again in 5 minutes.',
    showCancel: true,
    cancelText: 'OK',
    cancelModifier: 'cancel cta',
  },
  iframeoverlay: {
    iframeSrc: "https://marketplace-dev-cdn.allizom.org/media/docs/terms/es.html?20140717",
    ctaText: 'OK'
  },
  signout: {
    email: 'foobarbaz-whatever@floccinoccinihilipilification.com'
  }
};
