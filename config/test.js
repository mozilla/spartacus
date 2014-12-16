module.exports = {
  verifyUserURL: '/fake-verify',
  reVerifyUserURL: '/fake-reverify',
  browseridJsURL: '/testlib/stubbyid.js',
  resetUserURL: '/logout',
  useMinCSS: true,
  useMinJS: true,
  showClientConsole: false,
  staticURL: 'https://marketplace-dev-cdn.allizom.org/',
  appSettingsOverrides: JSON.stringify({
    enableWebPayments: false,
    validRedirSites: [
      'http://mozilla.bango.net',
      'https://zippy.pass.allizom.org',
      'http://localhost'
    ]
  })
};
