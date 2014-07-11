var http = require('http');

var crypto = require('crypto');
var express = require('express');
var i18n = require('i18n-abide');
var nunjucks = require('nunjucks');
var rewriteModule = require('http-rewrite-middleware');

// Node only config.
var config = require('../config/');
// Setting (shared by client-side + node);
var settings = require('../public/js/settings');

var spa = express();
var nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname + '/templates'),
                                           {autoescape: true});
nunjucksEnv.express(spa);

var env = spa.settings.env;

if (env !== 'test') {
  spa.use(require('connect-livereload')({
    port: config.liveReloadPort,
  }));
}

var servedViews = [
  'create-pin',
  'enter-pin',
  'locked',
  'reset-pin',
  'reset-start',
  'wait-to-start',
  'wait-to-finish',
  'was-locked',
];

spa.use(i18n.abide({
  supported_languages: settings.supportedLanguages,
  debug_lang: 'db-LB',
  default_lang: 'en-US',
  translation_directory: 'public/i18n'
}));

spa.use(rewriteModule.getMiddleware([
  // 301 / -> /mozpay
  {from: '^/$', to: '/mozpay/', redirect: 'permanent'},
  {from: '^/mozpay$', to: '/mozpay/', redirect: 'permanent'},
  // This is emulating the url used by webpay for wait-to-finish.
  {from: '^/mozpay/provider/boku/wait-to-finish', to: '/mozpay/'},
  // This is emulating the url used by webpay for payment success/failure.
  {from: '^/mozpay/provider/reference/(?:success|error|no-error-code)', to: '/mozpay/'},
  // Allow a view that sets an incorrect data-start-view attr.
  {from: '^/mozpay/bogus-start-attr', to: '/mozpay/'},
  // Internally redirect urls to be handled by the client-side spa serving view.
  {from: '^/mozpay/spa/(?:' + servedViews.join('|') + ')$', to: '/mozpay/'},
]));

spa.get(/\/(?:css|fonts|i18n|images|js|lib)\/?.*/, express.static(__dirname + '/../public'));

spa.get('/mozpay/', function (req, res) {
  var context = {settings: config};
  if (req.originalUrl === '/mozpay/provider/boku/wait-to-finish') {
    // This is emulating the url used by webpay for wait-to-finish.
    context.transaction_status_url = '/poll-wait-to-finish';
    context.startView = 'wait-to-finish';
  } else if (req.originalUrl === '/mozpay/bogus-start-attr') {
    // Set up a view that sets an incorrect data-start-view attr.
    context.startView = 'a-bogus-start-attr';
  } else if (req.originalUrl === '/mozpay/provider/reference/success') {
    // Set up that sets a example of success like webpay would.
    context.startView = 'payment-success';
  } else if (req.originalUrl === '/mozpay/provider/reference/error') {
    // Setup a view that sets a example of an error like webpay would.
    context.startView = 'payment-failed';
    context.errorCode = 'TEST_ERROR_CODE';
  } else if (req.originalUrl === '/mozpay/provider/reference/no-error-code') {
    // Setup a view that sets a example of an error like webpay would
    // but this time withn no error code attr.
    context.startView = 'payment-failed';
  }

  res.render('index.html', context);
});

// Serve test assets.
spa.get(/\/testlib\/?.*/, express.static(__dirname + '/../tests/static'));
spa.get(/\/unit\/?.*/, express.static(__dirname + '/../tests/'));

function genFakeResp(pin, status) {

  status = status || 200;
  pin = pin === true ? true : false;

  return function(req, res) {

    var result = {
      pin: pin,
      pin_is_locked_out: false,
      pin_was_locked_out: false,
      pin_locked_out: null
    };

    if (req.query.pin_is_locked_out) {
      result.pin_is_locked_out = true;
    }

    if (req.query.pin) {
      result.pin = true;
    }

    res.send(status, result);
  };
}

// Fake API responses for non-test dev env.
if (env !== 'test') {
  spa.get('/mozpay/v1/api/pin/', genFakeResp(true));
  spa.post('/mozpay/v1/api/pin/', genFakeResp(true));
  spa.post('/mozpay/v1/api/pin/check/', genFakeResp(true));

  spa.post('/mozpay/v1/api/pay/', function(req, res) {
    res.send(201, {provider: 'reference'});
  });

  // Fake verification.
  spa.post('/fake-verify', function (req, res) {
    var assertion = req.query.assertion ? req.query.assertion : '';
    var success = {
      'status': 'okay',
      'audience': 'http://localhost:' + config.test.port,
      'expires': Date.now(),
      'issuer': 'fake-persona',
      'user_hash': crypto.createHmac('sha256', 'noddy-key-dev-only').update(assertion).digest('hex')
    };
    success.email = assertion;
    res.send(success);
  });

  // Fake re-verification.
  spa.post('/fake-reverify', function (req, res) {
    var assertion = req.query.assertion ? req.query.assertion : '';
    var success = {
      'status': 'reverified okay',
      'audience': 'http://localhost:' + config.test.port,
      'expires': Date.now(),
      'issuer': 'fake-persona'
    };
    success.email = assertion;
    res.send(success);
  });

  // Fake wait-to-start
  spa.get('/poll-wait-to-start', function (req, res) {
    // O is STATUS_PENDING.
    res.send({'url': '/fake-provider', 'status': 0});
  });

  // Fake wait-to-finish
  spa.get('/poll-wait-to-finish', function(req, res) {
    // 1 is STATUS_COMPLETED
    res.send({'status': 1, 'url': null});
  });

}

// A pretend provider.
spa.get('/fake-provider', function(req, res) {
  res.render('fake-provider.html');
});

// Fake logout
spa.post('/logout', function (req, res) {
  res.send({'msg': 'logout success'});
});

spa.get('/unittests', function (req, res) {
  res.render('test.html');
});

console.log('Starting DEV Server');
var port = process.env.PORT || config.port;
http.createServer(spa).listen(port, function() {
  console.log('listening on port: ' + port);
});
