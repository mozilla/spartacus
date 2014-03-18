module.exports = {
  port: 7777,
  liveReloadPort: 35729,

  // Persona settings...
  // We only trust one issuer to grant us unverified emails.
  // If UNVERIFIED_ISSUER is set to None, forceIssuer will not
  // be sent to the client or the verifier.

  BROWSERID_UNVERIFIED_ISSUER: 'firefoxos.persona.org',
  BROWSERID_VERIFICATION_URL: 'https://login.persona.org/verify',
  BROWSERID_JS_URL: 'https://login.persona.org/include.js',

  styleguide: {
    port: 7779,
    liveReloadPort: 35729,
  },
  // Unittests.
  test: {
    port: 7778,
  },
};
