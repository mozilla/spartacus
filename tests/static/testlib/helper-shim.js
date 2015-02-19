var v;
if (require.globals) {
  // SlimerJS
  require.globals.casper = casper;
  casper.echo('Running under SlimerJS', 'WARN');
  v = slimer.version;
  casper.isSlimer = true;
} else {
  // PhantomJS
  casper.echo('Running under PhantomJS', 'WARN');
  v = phantom.version;
}
casper.echo('Version: ' + v.major + '.' + v.minor + '.' + v.patch);
/* exported helpers */
var helpers = require(require('fs').absolute('tests/helpers'));
