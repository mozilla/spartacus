var http = require('http');

var express = require('express');
var i18n = require('i18n-abide');
var nunjucks = require('nunjucks');
var rewriteModule = require('http-rewrite-middleware');

var config = require('../config/');


var app = express();

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname + '/templates'),
                                   {autoescape: true});

app.use(require('connect-livereload')({
  port: config.liveReloadPort,
}));

env.express(app);

app.use(i18n.abide({
  /*jshint camelcase: false */
  supported_languages: config.supportedLanguages,
  debug_lang: 'db-LB',
  default_lang: 'en-US',
  translation_directory: 'public/i18n'
}));

app.use(rewriteModule.getMiddleware([
  {from: '^/(?:login|create-pin|enter-pin|reset-pin|locked|throbber|was-locked)', to: '/'},
]));

app.get(/\/(?:css|fonts|i18n|images|js|lib)\/?.*/, express.static(__dirname + '/../public'));

app.get('/', function (req, res) {
  res.render('index.html');
});

var port = process.env.PORT || config.port;

http.createServer(app).listen(port, function() {
  console.log('listening on port: ' + port);
});
