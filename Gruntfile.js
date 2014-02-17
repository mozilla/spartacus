var rewriteModule = require('http-rewrite-middleware');
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
          middleware: function (connect, options) {
            var middlewares = [];

            // RewriteRules support
            middlewares.push(rewriteModule.getMiddleware([
              {from: '^/(?:login|create-pin|enter-pin|reset-pin|locked|throbber|was-locked)$', to: '/index.html'},
            ]));

            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }

            var directory = options.directory || options.base[options.base.length - 1];
            options.base.forEach(function (base) {
              // Serve static files.
              middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            middlewares.push(connect.directory(directory));

            return middlewares;
          }
        },
      },
      tests: {
        options: {
          base: '.',
          hostname: '*',
          port: devConfig.testsPort,
          keepalive: true
        }
      }
    },
    watch: {
      stylus: {
        files: ['public/**/*.styl', 'public/images/'],
        tasks: 'stylus',
      },
      css: {
        files: ['public/css/*.css'],
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
      js: {
        files: ['public/**/*.js'],
        options: {
          livereload: devConfig.liveReloadPort
        }
      },
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: 'jshint',
      },
      nunjucks: {
        files: 'templates/*',
        tasks: ['nunjucks']
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
    },
    nunjucks: {
      options: {
        env: require('./public/js/nunjucks-env'),
        name: function(filename) {
          return filename.replace(/^templates\//, '');
        }
      },
      precompile: {
        src: 'templates/*',
        dest: 'public/js/templates.js',
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
  grunt.loadNpmTasks('grunt-nunjucks');
  //grunt.loadNpmTasks('grunt-i18n-abide');

  grunt.registerTask('default', ['jshint', 'stylus']);
  grunt.registerTask('server', ['jshint', 'stylus', 'nunjucks', 'connect:devel', 'watch']);
};
