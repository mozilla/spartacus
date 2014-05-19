var _ = require('underscore');

var config = require('../config');

var _currTestId;
var _currentEmail;
var _testInited = {};

var baseTestUrl = 'http://localhost:' + config.test.port;
var basePath = '/mozpay/spa';

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
    casper.evaluate(function(){
      window._phantom = 1;
      localStorage.clear();
    });
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
  casper.echo('Injecting Sinon', 'INFO');
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


function clientTimeoutResponse(method, url) {
  casper.evaluate(function(method, url) {
    window.server.respondWith(method, url, function(xhr) {
      console.log('timeout');
      xhr.status = 0;
      xhr.statusText = 'timeout';
      xhr.readyState = sinon.FakeXMLHttpRequest.UNSENT;
      xhr.abort();
    });
  }, method, url);
}


function fakeVerification(options) {
  options = options || {};
  var timeout = options.timeout || false;
  if (timeout) {
    casper.echo('Setting up a fake XHR timeout for verification', 'INFO');
    clientTimeoutResponse('POST', '/fake-verify');
  } else {
    casper.echo('Setting up a fake verification success', 'INFO');
    casper.evaluate(function(statusCode) {
      window.server.respondWith('POST', '/fake-verify',
        [statusCode, {'Content-Type': 'application/json'}, JSON.stringify({
          'status': 'okay',
          'audience': 'http://localhost',
          'expires': Date.now(),
          'issuer': 'fake-persona'
        })]);
    }, options.statusCode || 200);
  }
}


function fakeStartTransaction(options) {
  options = options || {};
  var timeout = options.timeout || false;
  if (timeout) {
    casper.echo('Setting up an XHR timeout for start of transaction', 'INFO');
    clientTimeoutResponse('POST', '/mozpay/v1/api/pay/');
  } else {
    casper.echo('Setting up successful transaction start response', 'INFO');
    casper.evaluate(function(statusCode) {
      window.server.respondWith('POST', '/mozpay/v1/api/pay/', [statusCode, {'Content-Type': 'application/json'}, '{}']);
    }, options.statusCode || 201);
  }
}


function fakeBrokenJSON(method, statusCode, url) {
  method = method || 'GET';
  url = url || '/mozpay/v1/api/pin/';
  statusCode = statusCode || 200;
  casper.echo('Setting up bad JSON with SINON', 'INFO');
  casper.echo([ method, statusCode, url], 'COMMENT');
  casper.evaluate(function(pinData, method, statusCode, url) {
    console.log([method, url, statusCode]);
    window.server.respondWith(method, url, [statusCode, {'Content-Type': 'application/json'}, {invalidJSON: true}]);
  }, method, statusCode, url);
}


function fakePinData(overrides, method, statusCode, url) {
  method = method || 'GET';
  url = url || '/mozpay/v1/api/pin/';
  statusCode = statusCode || 200;
  var pinData = _.clone(pinDefaults);
  _.extend(pinData, overrides || {});
  pinData = JSON.stringify(pinData);
  casper.echo('Setting up fakePinData with Sinon', 'INFO');
  casper.echo([pinData, method, statusCode, url], 'INFO');
  casper.evaluate(function(pinData, method, statusCode, url) {
    window.server.respondWith(method, url, [statusCode, {'Content-Type': 'application/json'}, pinData]);
  }, pinData, method, statusCode, url);
}


function doLogin() {
  casper.waitForUrl(basePath + '/login', function() {
    logInAsNewUser();
  });
}


function startCasper(options) {
  options = options || {};
  if (options.url) {
    casper.echo('You supplied a "url" option when you probably meant "path"', 'WARNING');
  }
  var setUp = options.setUp;
  var path = options.path || '/mozpay/?req=foo';
  var url = baseTestUrl + path;
  casper.echo('Starting with url: ' + url);
  var callback = (function(setUp) {
    return function() {
      injectSinon();
      if (typeof setUp === 'function') {
        setUp();
      }
    };
  })(setUp);
  casper.start(url, callback);
}


function assertErrorCode(errorCode) {
  casper.test.assertSelectorHasText('.error-code', errorCode, '.error-code should contain: ' + errorCode);
}


function url(path) {
  path = path.replace(/^\//, '');
  return basePath + '/' + path;
}


module.exports = {
  assertErrorCode: assertErrorCode,
  doLogin: doLogin,
  basePath: basePath,
  fakeBrokenJSON: fakeBrokenJSON,
  fakePinData: fakePinData,
  fakeStartTransaction: fakeStartTransaction,
  fakeVerification: fakeVerification,
  injectSinon: injectSinon,
  setLoginFilter: setLoginFilter,
  startCasper: startCasper,
  url: url,
};
