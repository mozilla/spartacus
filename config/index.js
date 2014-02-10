var fs = require('fs');
var _ = require('underscore');

var config = require('./default') || {};

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

module.exports = config;
