var http = require('http');

var express = require('express');
var i18n = require('i18n-abide');
var nunjucks = require('nunjucks');
var rewriteModule = require('http-rewrite-middleware');

// Node only config.
var config = require('../config/');
// Setting (shared by client-side + node);
var settings = require('../public/js/settings/settings');

var spa = express();
var nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname + '/templates'),
                                           {autoescape: true});
nunjucksEnv.express(spa);

var env = spa.settings.env;

spa.use(require('connect-livereload')({
  port: config.liveReloadPort,
}));


var servedViews = [
  'create-pin',
  'enter-pin',
  'locked',
  'login',
  'reset-pin',
  'reset-start',
  'wait-for-tx',
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
  // Internally redirect urls to be handled by the client-side spa serving view.
  {from: '^/mozpay/spa/(?:' + servedViews.join('|') + ')$', to: '/mozpay/'},
]));

spa.get(/\/(?:css|fonts|i18n|images|js|lib)\/?.*/, express.static(__dirname + '/../public'));

spa.get('/mozpay/', function (req, res) {
  res.render('index.html', {settings: config});
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
    res.send(201, {});
  });
}

// Fake verification.
spa.post('/fake-verify', function (req, res) {
  var assertion = req.query.assertion ? req.query.assertion : '';
  var success = {
    'status': 'okay',
    'audience': 'http://localhost:' + config.test.port,
    'expires': Date.now(),
    'issuer': 'fake-persona'
  };
  success.email = assertion;
  res.send(success);
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
