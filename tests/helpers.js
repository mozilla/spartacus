var _ = require('underscore');

var config = require('../config');

var _currTestId;
var _currentEmail;
var _testInited = {};

var baseTestUrl = 'http://localhost:' + config.test.port;
var pinDefaults = {
  pin: false,
  pin_is_locked_out: false,
  pin_was_locked_out: false,
  pin_locked_out: null
};

casper.options.clientScripts = [
  // Add poly-fill for Function.prototype.bind.
  'tests/static/testlib/bind-poly.js',
  // Add sinon for server response faking.
  'public/lib/js/sinon/index.js'
];


function makeToken() {
  // Return a random ascii string.
  return Math.random().toString(36).slice(2);
}


casper.on('page.initialized', function(page) {
  if (!_testInited[_currTestId]) {
    // Only initialize the browser state once per test run.
    casper.echo('Clearing browser state', 'INFO');
    page.clearCookies();
    casper.evaluate(function(){ localStorage.clear(); });
    _testInited[_currTestId] = true;
  }
});


casper.on('started', function() {
  _currTestId = makeToken();
  casper.echo('starting test');
});


casper.on('waitFor.timeout', function() {
  var file = 'tests/captures/timeout-' + _currTestId + '.png';
  casper.echo('timeout screenshot at ' + file);
  casper.capture(file);
});


casper.test.on('fail', function() {
  var file = 'tests/captures/fail-' + _currTestId + '.png';
  casper.echo('Failed test screenshot at ' + file);
  casper.capture(file);
});


// Inject stubbyid.js inplace of include.js for testing.
casper.on('resource.requested', function(reqData, req) {
  if (reqData.url === 'https://login.persona.org/include.js') {
    casper.echo('Substituting stubbyid.js for login.persona.org/include.js', 'INFO');
    req.changeUrl(baseTestUrl + '/testutils/lib/stubbyid.js');
  }
});


if (config.showClientConsole === true) {
  casper.on('remote.message', function(message) {
    casper.echo('client console: ' + message, 'INFO');
  });
}


function setLoginFilter(emailAddress) {
  // Set a global email to use in the new filter call.
  // This should work as long as logins are done synchronously.
  _currentEmail = emailAddress;

  // This call seems to only be honored once, i.e. there's no way to
  // clear the last filter. But maybe there is a way? FIXME.
  casper.setFilter("page.prompt", function(msg) {
    if (msg === "Enter email address") {
      this.echo('Entering email address: ' + _currentEmail, "INFO");
      return _currentEmail;
    }
  });
}


function logInAsNewUser() {
  // Sets the filter so we always login as a new user.
  var email = "tester+" + makeToken() + "@fakepersona.mozilla.org";
  setLoginFilter(email);

  casper.waitFor(function check() {
    return this.visible('#signin');
  }, function then() {
    casper.test.assertVisible('#signin', 'Check signin element is present.');
    this.click('#signin');
  }, function timeout() {
    casper.test.fail('#signin was not visible');
  });

  return email;
}





function injectSinon() {
  casper.evaluate(function() {
    window.server = sinon.fakeServer.create();
    window.server.autoRespond = true;
  });
  // Setup the teardown when injecting.
  casper.test.tearDown(function() {
    casper.echo('Tearing down Sinon', 'INFO');
    casper.evaluate(function() {
      window.server.restore();
    });
  });
}


function fakeVerificationSuccess() {
  casper.echo('Faking verification success with Sinon', 'INFO');
  casper.evaluate(function() {
    window.server.respondWith('POST', '/fake-verify',
      [200, {'Content-Type': 'application/json'}, JSON.stringify({
        'status': 'okay',
        'audience': 'http://localhost',
        'expires': Date.now(),
        'issuer': 'fake-persona'
      })]);
  });
}


function fakePinData(overrides, method, statusCode, url) {
  method = method || 'GET';
  url = url || '/mozpay/v1/api/pin/';
  statusCode = statusCode || 200;
  var pinData = _.clone(pinDefaults);
  _.extend(pinData, overrides || {});
  pinData = JSON.stringify(pinData);
  casper.echo('Setting up fakePinData with Sinon', 'INFO');
  casper.echo([pinData, method, statusCode, url], 'COMMENT');
  casper.evaluate(function(pinData, method, statusCode, url) {
    console.log([pinData, method, url, statusCode]);
    window.server.respondWith(method, url, [statusCode, {'Content-Type': 'application/json'}, pinData]);
  }, pinData, method, statusCode, url);
  //casper.evaluate(function(pinData) {
  //  window.server.respondWith('GET', '/mozpay/v1/api/pin/', [200, {'Content-Type': 'application/json'}, pinData]);
  //}, pinData);
}


function doLogin() {
  casper.waitForUrl('/mozpay/login', function() {
    logInAsNewUser();
  });
}


function startCasper(path, cb) {
  var url = baseTestUrl + path;
  casper.echo('Starting with url: ' + url);

  var callback = (function(cb) {
    return function() {
      injectSinon();
      fakeVerificationSuccess();
      if (typeof cb === 'function') {
        cb();
      }
    };
  })(cb);

  casper.start(url, callback);
}


module.exports = {
  doLogin: doLogin,
  fakePinData: fakePinData,
  fakeVerificationSuccess: fakeVerificationSuccess,
  injectSinon: injectSinon,
  setLoginFilter: setLoginFilter,
  startCasper: startCasper,
};
