module.exports = function(grunt) {
  grunt.initConfig({
    bower: {
      styleguide: {
        options: {
          targetDir: './static/lib',
          layout: 'byType',
          install: true,
          bowerOptions: {
            production: true,
          }
        }
      }
    }
  });

  // Always show stack traces when Grunt prints out an uncaught exception.
  grunt.option('stack', true);
  grunt.loadNpmTasks('grunt-bower-task');
};
