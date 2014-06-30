module.exports = {
  verifyUserURL: '/fake-verify',
  reVerifyUserURL: '/fake-reverify',
  browseridJsURL: '/testlib/stubbyid.js',
  resetUserURL: '/logout',
  useMinCSS: true,
  useMinJS: true,
  showClientConsole: true,
  appSettingsOverrides: JSON.stringify({
    validRedirSites: [
      'http://mozilla.bango.net',
      'https://zippy.pass.allizom.org',
      'http://localhost'
    ]
  })
};
