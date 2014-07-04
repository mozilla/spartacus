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


function injectSinon(options) {
  options = options || {};
  var autoRespond = (typeof options.autoRespond === 'undefined') ? true : options.autoRespond;
  var consumeStack = options.consumeStack || false;

  casper.echo('Injecting Sinon', 'INFO');
  casper.echo('Sinon Server autoRespond: ' + autoRespond);
  casper.echo('Sinon Server consumeStack: ' + consumeStack);
  casper.evaluate(function(autoRespond, consumeStack) {
    window.server = sinon.fakeServer.create();
    window.server.autoRespond = autoRespond;
    if (consumeStack) {
      // This changes processRequest so it consumes each response from the stack
      // on first use. This is required for things like poll requests and being able
      // to specify several different responses in order.
      window.server._oldProcessRequest = window.server.processRequest;
      window.server.processRequest = function processRequest(request) {
        // Unfortunately we need a whole heap of utility funcs as they're not exposed in Sinon.
        var wloc = typeof window !== "undefined" ? window.location : {};
        var rCurrLoc = new RegExp("^" + wloc.protocol + "//" + wloc.host);
        function matchOne(response, reqMethod, reqUrl) {
          var rmeth = response.method;
          var matchMethod = !rmeth || rmeth.toLowerCase() === reqMethod.toLowerCase();
          var url = response.url;
          var matchUrl = !url || url === reqUrl || (typeof url.test === "function" && url.test(reqUrl));
          return matchMethod && matchUrl;
        }
        function match(response, request) {
          var requestUrl = request.url;
          if (!/^https?:\/\//.test(requestUrl) || rCurrLoc.test(requestUrl)) {
            requestUrl = requestUrl.replace(rCurrLoc, "");
          }
          if (matchOne(response, this.getHTTPMethod(request), requestUrl)) {
            if (typeof response.response === "function") {
              var ru = response.url;
              var args = [request].concat(ru && typeof ru.exec === "function" ? ru.exec(requestUrl).slice(1) : []);
              return response.response.apply(response, args);
            }
            return true;
          }
          return false;
        }

        try {
          if (request.aborted) {
            return;
          }

          var response = this.response || [404, {}, ""];

          if (this.responses) {
            console.log(JSON.stringify(this.responses));
            for (var i=0, j=this.responses.length; i<j; i++) {
              if (match.call(this, this.responses[i], request)) {
                response = this.responses[i].response;
                this.responses.splice(i, 1);
                break;
              } else if (typeof this.responses[i].response === 'function') {
                console.log('Removing function based response');
                this.responses.splice(i, 1);
                break;
              }
            }
          }

          if (request.readyState !== 4) {
            request.respond(response[0], response[1], response[2]);
          }
        } catch (e) {
          console.log('Sinon exception error', e);
          throw e;
        }
      };
    }
  }, autoRespond, consumeStack);
  // Setup the teardown when injecting.
  casper.test.tearDown(function() {
    casper.echo('Tearing down Sinon', 'INFO');
    casper.evaluate(function(consumeStack) {
      if (consumeStack && window.server._oldProcessRequest) {
        console.log('restoring server.processRequest');
        window.server.processRequest = window.server._oldProcessRequest;
      }
      window.server.responses = [];
      window.server.restore();
    }, consumeStack);
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
  var url = options.reverify === true ? '/fake-reverify' : '/fake-verify';
  // This doesn't reflect the real response but allows us to
  // know if the response represents a verification or reverification.
  var statusData = options.reverify === true ? 'reverify' : 'verify';
  var statusCode = options.statusCode || 200;
  var timeout = options.timeout || false;
  if (timeout) {
    casper.echo('Setting up a fake XHR timeout for verification', 'INFO');
    clientTimeoutResponse('POST', url);
  } else {
    casper.echo('Setting up a fake verification success', 'INFO');
    casper.evaluate(function(statusCode, statusData, url) {
      window.server.respondWith('POST', url,
        [statusCode, {'Content-Type': 'application/json'}, JSON.stringify({
          'status': statusData,
          'audience': 'http://localhost',
          'expires': Date.now(),
          'issuer': 'fake-persona',
          'user_hash': 'test-hash'
        })]);
    }, statusCode, statusData, url);
  }
}


function fakeLogout(options) {
  options = options || {};
  var statusCode = options.statusCode || 200;
  var timeout = options.timeout || false;
  if (timeout) {
    casper.echo('Setting up a fake XHR timeout for logout', 'INFO');
    clientTimeoutResponse('POST', '/logout');
  } else {
    casper.evaluate(function(statusCode) {
      window.server.respondWith('POST', '/logout',
        [statusCode, {'Content-Type': 'application/json'}, JSON.stringify({
          'status': 'ok',
        })]);
    }, statusCode);
  }
}


function fakeWaitPoll(options) {
  options = options || {};
  var statusCode = options.statusCode || 200;
  var timeout = options.timeout || false;
  var url;
  var statusData;
  var urlData;

  if (options.type === 'start') {
    // Setup Pending for wait-to-start
    statusData = options.statusData || 0;
    url = '/poll-wait-to-start';
    urlData = options.urlData || '/fake-provider';
  } else if (options.type === 'finish') {
    statusData = options.statusData || 1;
    url = '/poll-wait-to-finish';
    urlData = options.urlData || null;
  } else {
    casper.fail('type options should be either "start" or "finish"');
  }

  if (timeout) {
    casper.echo('Setting up a fake XHR timeout for wait Poll', 'INFO');
    clientTimeoutResponse('GET', url);
  } else {
    casper.evaluate(function(url, statusCode, statusData, urlData) {
      window.server.respondWith('GET', url,
        [statusCode, {'Content-Type': 'application/json'}, JSON.stringify({
          'status': statusData,
          'url': urlData,
        })]);
    }, url, statusCode, statusData, urlData);
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
    var data = JSON.stringify(options.data || {provider: "boku"});
    casper.evaluate(function(statusCode, data) {
      window.server.respondWith('POST', '/mozpay/v1/api/pay/', [statusCode, {'Content-Type': 'application/json'}, data]);

    }, options.statusCode || 201, data);
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


function fakePinData(options) {
  var method = options.method || 'GET';
  var url = options.url || '/mozpay/v1/api/pin/';
  if (options.timeout) {
    casper.echo('Setting up a fake XHR timeout for fakePinData', 'INFO');
    clientTimeoutResponse(method, url);
  } else {
    var statusCode = options.statusCode || 200;
    var overrides = options.data || {};
    var pinData = _.clone(pinDefaults);
    _.extend(pinData, overrides);
    pinData = JSON.stringify(pinData);
    casper.echo('Setting up fakePinData with Sinon', 'INFO');
    casper.echo([pinData, method, statusCode, url], 'INFO');
    casper.evaluate(function(pinData, method, statusCode, url) {
      window.server.respondWith(method, url, [statusCode, {'Content-Type': 'application/json'}, pinData]);
    }, pinData, method, statusCode, url);
  }
}


function doLogin() {
  logInAsNewUser();
}


function startCasper(options) {
  options = options || {};
  if (options.url) {
    casper.echo('You supplied a "url" option when you probably meant "path"', 'WARNING');
  }
  var headers = options.headers;
  var path = options.path || '/mozpay/?req=foo';
  var setUp = options.setUp;
  var url = baseTestUrl + path;
  casper.echo('Starting with url: ' + url);

  var sinonOptions = options.sinon || {};

  var callback = (function(setUp) {
    return function() {
      injectSinon(sinonOptions);
      if (typeof setUp === 'function') {
        setUp();
      }
    };
  })(setUp);

  if (!headers) {
    casper.start(url, callback);
  } else {
    casper.start();
    casper.echo(JSON.stringify(headers));
    casper.open(url, {headers: headers}).then(function() {
      callback.call(this);
    });
  }
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
  fakeLogout: fakeLogout,
  fakePinData: fakePinData,
  fakeStartTransaction: fakeStartTransaction,
  fakeVerification: fakeVerification,
  fakeWaitPoll: fakeWaitPoll,
  injectSinon: injectSinon,
  setLoginFilter: setLoginFilter,
  startCasper: startCasper,
  url: url,
};
