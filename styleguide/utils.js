var nunjucks = require('nunjucks');
var prettyHTML = require('js-beautify').html;

var APP_TEMPLATE_DIR = __dirname + '/../templates';
var templateDirs = [
  __dirname + '/templates',
  APP_TEMPLATE_DIR
];

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templateDirs),
                                   {autoescape: true});

module.exports = {
  env: env,
  prettyTemplateRender: function(template, req, context) {
    context = context || {};
    context.gettext = req.gettext;
    return prettyHTML(env.render(template, context), {
      "indent_size": 2,
      "indent_char": " ",
      "indent_with_tabs": false,
      "preserve_newlines": false,
    }).replace(/^[ \t]*?$\r?\n/mg, "");
  }
};
