var fs = require('fs');
var _ = require('underscore');


function getNodeEnv() {
  var env;
  if (typeof process !== 'undefined' && process.env) {
    env = process.env.NODE_ENV;
  } else {
    // Casper.
    var system = require('system');
    env = system.env.NODE_ENV;
  }
  return env;
}


var config = require('./default') || {};

if (getNodeEnv() !== 'test') {
  try {
    var localConf = require('./local');
    _.extend(config, localConf || {});
  } catch(err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err;
    }
    var dest = __dirname + '/local.js';
    fs.writeFileSync(dest, fs.readFileSync(__dirname + '/local-dist.js'));
    console.warn('Created a local config file at ', dest,
                 '; update it with real values.');
  }
} else {
  var testConf = require('./test');
  _.extend(config, testConf || {});
}

module.exports = config;
