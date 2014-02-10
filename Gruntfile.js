var devConfig = require('./config');


module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: __dirname + '/.jshintrc'
      },
      files: [
        'Gruntfile.js',
      ],
    },
    stylus: {
      options: {
        'compress': false,
        'banner': '/* Generated content - do not edit - <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        'include css': true,
        'resolve url': true,
        'paths': [
          'public/images',
          'public/lib/css/',
          'public/stylus/inc',
          'public/stylus/lib',
        ],
        'urlfunc': 'embedurl',
        'import': [
          'normalize-css/normalize.css',
          'inc/vars',
          'inc/mixins',
          'inc/global',
        ]
      },
      compile: {
        expand: true,
        cwd: 'public/stylus',
        src: ['*.styl', '!_*.styl'],
        dest: 'public/css/',
        ext: '.css',
      }
    },
    // Development only static server.
    // Keeps running by virtue of running 'watch' afterwards.
    // See 'server' task below.
    connect: {
      devel: {
        options: {
          base: 'public',
          debug: true,
          hostname: '*',
          livereload: devConfig.liveReloadPort,
          port: devConfig.port,
        },
      }
    },
    watch: {
      stylus: {
        files: ['public/**/*.styl', 'public/images/'],
        tasks: 'stylus',
        options: {
          livereload: devConfig.liveReloadPort
        }
      },
      html: {
        files: ['public/**/*.html'],
        options: {
          livereload: devConfig.liveReloadPort
        }
      },
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: 'jshint',
      }

    },
    bower: {
      install: {
        options: {
          targetDir: 'public/lib',
          layout: 'byType',
          install: true,
          bowerOptions: {
            // Do not install project devDependencies
            production: true,
          }
        }
      }
    }
  });

  // Always show stack traces when Grunt prints out an uncaught exception.
  grunt.option('stack', true);

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-i18n-abide');

  grunt.registerTask('default', ['jshint', 'stylus']);
  grunt.registerTask('server', ['jshint', 'stylus', 'connect', 'watch']);
};
