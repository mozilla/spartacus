// Nunjucks env for both node (pre-compilation) + browser.
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  var nunjucks = require('nunjucks');
  var env = nunjucks.configure({ autoescape: true });
  module.exports = env;
} else if (typeof define === 'function' && define.amd) {
  define(['nunjucks', 'templates'], function(nunjucks) {
    return nunjucks.configure({ autoescape: true });
  });
}
