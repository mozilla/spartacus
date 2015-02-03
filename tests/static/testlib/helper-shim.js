if (require.globals) {
  // Slimer
  require.globals.casper = casper;
  casper.echo('Running under SlimerJS', 'WARN');
  var v = slimer.version;
  casper.echo('Version: ' + v.major + '.' + v.minor + '.' + v.patch);
  var helpers = require(require('fs').absolute('tests/helpers'));
} else {
  // PhantomJS
  casper.echo('Running under PhantomJS', 'WARN');
  var helpers = require('../helpers');
}
