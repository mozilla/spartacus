module.exports = function(grunt) {

  // Dev-only config.
  var config = require('./config');
  // App Settings. Also used client-side.
  var settings = require('./public/js/settings.js');
  // The requirejs config data.
  var requireConfig = require('./public/js/require-config.js');

  if (!process.env.SLIMERJSLAUNCHER) {
    grunt.warn('You need to set the env var SLIMERJSLAUNCHER to point at the version of Firefox you want to use\n' +
               'See http://docs.slimerjs.org/current/installation.html#configuring-slimerjs for more details\n\n');
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    casper: {
      options : {
        test: true,
        includes: ['tests/static/testlib/helper-shim.js', 'tests/static/testlib/bind-poly.js'],
        verbose: true,
      },
      slimer : {
        options: {
          engine: 'slimerjs'
        },
        src: [grunt.option('test') || 'tests/ui/test-*.js'],
      },
      phantom: {
        options: {
          engine: 'phantomjs'
        },
        src: [grunt.option('test') || 'tests/ui/test-*.js'],
      }
    },

    clean: {
      uitest: ['tests/captures/*'],
      templates: ['public/js/templates.js']
    },

    env: {
      dev: {
        NODE_ENV: 'development'
      },
      test: {
        NODE_ENV: 'test'
      }
    },

    jshint: {
      options: {
        jshintrc: __dirname + '/.jshintrc'
      },
      files: [
        'config/**/*.js',
        'public/js/**/*.js',
        '!public/js/templates.js',
        '!public/js/main.min.js',
        'Gruntfile.js'
      ],
    },

    stylus: {
      options: {
        'compress': config.useMinCSS,
        'banner': '/* Generated content - do not edit - <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        'include css': true,
        'resolve url': true,
        'urlfunc': 'embedurl'
      },
      public: {
        options: {
          'paths': [
            'public/images',
            'public/lib/css/',
            'public/stylus/inc',
            'public/stylus/lib',
          ],
          'import': [
            'normalize-css/normalize.css',
            'inc/vars',
            'inc/mixins',
            'inc/global',
          ]
        },
        expand: true,
        cwd: 'public/stylus',
        src: ['*.styl', '!_*.styl'],
        dest: 'public/css/',
        ext: '.css',
      },

      styleguide: {
        options: {
          'import': [
            '../../../../public/stylus/inc/vars',
            '../../../../public/stylus/inc/mixins',
            '../../../../public/stylus/inc/global',
          ]
        },
        expand: true,
        cwd: 'styleguide/static/src/stylus',
        src: ['*.styl', '!_*.styl'],
        dest: 'styleguide/static/src/css/',
        ext: '.css',
      }
    },

    express: {
      dev: {
        options: {
          script: 'server/index.js',
          background: true,
          port: config.port,
          debug: false
        }
      },
      styleguide: {
        options: {
          script: 'styleguide/index.js',
          background: true,
          port: config.styleguide.port,
          debug: false,
        }
      },
      test: {
        options: {
          script: 'server/index.js',
          background: true,
          port: config.test.port,
          debug: false,
        }
      }
    },

    watch: {
      options: {
        interval: 10000,
      },
      styluspublic: {
        files: ['public/**/*.styl', 'public/images/'],
        tasks: 'stylus'
      },
      stylusstyleguide: {
        files: ['styleguide/static/**/*.styl'],
        tasks: 'stylus'
      },
      css: {
        files: ['public/css/*.css', 'styleguide/static/**/*.css'],
        options: {
          livereload: config.liveReloadPort
        }
      },
      html: {
        files: ['public/**/*.html'],
        options: {
          livereload: config.liveReloadPort
        }
      },
      js: {
        files: ['public/**/*.js'],
        options: {
          livereload: config.liveReloadPort
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
      default: {
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
    },

    shell: {
      unittests: {
        command: 'mocha-phantomjs http://localhost:' + config.test.port + '/unittests',
        options: {
          stderr: true,
          stdout: true,
          failOnError: true,
        }
      }
    },

    abideCreate: {
      default: { // Target name.
        options: {
          template: 'locale/templates/LC_MESSAGES/messages.pot', // (default: 'locale/templates/LC_MESSAGES/messages.pot')
          languages: settings.supportedLanguages,
          localeDir: 'locale',
        }
      }
    },

    abideExtract: {
      js: {
        src: [
          'public/**/*.js',
          '!public/js/main.min.js'
        ],
        dest: 'locale/templates/LC_MESSAGES/messages.pot',
        options: {
          language: 'JavaScript',
        }
      },
      html: {
        src: 'templates/*.html',
        dest: 'locale/templates/LC_MESSAGES/messages.pot',
        options: {
          language: 'Jinja',
        }
      },
    },

    abideMerge: {
      default: { // Target name.
        options: {
          template: 'locale/templates/LC_MESSAGES/messages.pot', // (default: 'locale/templates/LC_MESSAGES/messages.pot')
          localeDir: 'locale',
        }
      }
    },

    abideCompile: {
      json: {
        dest: 'public/i18n',
        options: {
          lockFileName: grunt.option('lockfile-name'),
          type: 'json',
          jsVar: '_i18nAbide'
        },
      },
    },

    requirejs: {
      compile: {
        options: grunt.util._.merge(requireConfig, {
          include: ['../lib/js/requirejs/require.js'],
          findNestedDependencies: true,
          name: 'main',
          baseUrl: 'public/js',
          optimize: 'uglify2',
          out: 'public/js/main.min.js'
        })
      }
    },
  });


  // Always show stack traces when Grunt prints out an uncaught exception.
  grunt.option('stack', true);

  if (process.env.IS_DOCKER) {
    // Workaround having node_modules in parent dir for Docker.
    grunt.file.expand('../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
  } else {
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-casper');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-nunjucks');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-i18n-abide');
    grunt.loadNpmTasks('grunt-express-server');
  }

  grunt.registerTask('default', 'Does the same thing as grunt start', ['start']);
  grunt.registerTask('start', 'Run the development server',
                     ['abideCompile', 'env:dev', 'jshint', 'clean:templates', 'nunjucks', 'requirejs', 'stylus', 'express:dev', 'watch']);
grunt.registerTask('start-test-server', 'Run the development server',
                     ['abideCompile', 'env:test', 'jshint', 'clean:templates', 'nunjucks', 'requirejs', 'stylus', 'express:test', 'watch']);
  grunt.registerTask('docker', 'Run the processes for docker',
                     ['abideCompile', 'jshint', 'clean:templates', 'nunjucks', 'requirejs', 'stylus', 'watch']);
  grunt.registerTask('styleguide', 'Run the styleguide server',
                     ['stylus', 'express:styleguide', 'watch']);
  grunt.registerTask('test', 'Run unit tests',
                     ['abideCompile', 'env:test', 'jshint', 'stylus', 'clean:templates', 'nunjucks', 'express:test', 'shell:unittests']);
  grunt.registerTask('uitest', 'Run UI tests with casper.\nUsage: grunt uitest [--test <file>]',
                     ['abideCompile', 'env:test', 'clean:templates', 'nunjucks', 'requirejs', 'stylus', 'clean:uitest', 'express:test', 'casper']);
};
