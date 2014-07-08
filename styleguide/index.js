var http = require('http');
var express = require('express');
var i18n = require('i18n-abide');
var rewriteModule = require('http-rewrite-middleware');

var views = require('./views');
var viewsiframe = require('./viewsiframe');
var utils = require('./utils');
var config = require('../config/');

var app = express();

app.set('view options', { pretty: true });

var env = utils.env;

//app.use(require('connect-livereload')({
// port: config.styleguide.liveReloadPort,
// }));

env.express(app);

app.use(i18n.abide({
  supported_languages: config.supportedLanguages,
  debug_lang: 'db-LB',
  default_lang: 'en-US',
  translation_directory: 'public/i18n'
}));

app.use(rewriteModule.getMiddleware([
  {from: '^/lib/css/fonts/(.*)', to: '/lib/fonts/bootstrap/$1'},
]));

app.get(/\/(?:css|fonts|i18n|images)\/?.*/, express.static(__dirname + '/../public'));
app.get(/\/(?:lib|src)\/?.*/, express.static(__dirname + '/static'));

app.get('/', views.index);

// Styleguide views.
app.get('/buttons', views.buttons);
app.get('/create-pin', views.createpin);
app.get('/error', views.error);
app.get('/typography', views.typography);
app.get('/throbber', views.throbber);
app.get('/was-locked', views.waslocked);
app.get('/locked', views.locked);

// Iframed Example Pages
app.get('/if/buttons', viewsiframe.buttons);
app.get('/if/create-pin', viewsiframe.createpin);
app.get('/if/error', viewsiframe.error);
app.get('/if/typography', viewsiframe.typography);
app.get('/if/throbber', viewsiframe.throbber);
app.get('/if/was-locked', viewsiframe.waslocked);
app.get('/if/locked', viewsiframe.locked);

http.createServer(app).listen(config.styleguide.port, function() {
  console.log('Listening on port: ' + config.styleguide.port);
});


