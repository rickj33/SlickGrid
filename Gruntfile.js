/* jshint node: true */
/*!
 * slickGrid's Gruntfile
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');
    var _ = require('lodash');


  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
              ' * slickGrid v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' +
              ' */\n',
    bannerDocs: '/*!\n' +
              ' * slickGrid Docs (<%= pkg.homepage %>)\n' +
              ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' +
              ' * NDA applies, etc.etc.etc.\n' +
              ' */\n',
    jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'slickGrid requires jQuery\') }\n\n',

    // Task configuration.
    clean: {
      dist: 'dist'
    },




    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['slick.*.js', 'controls/*.js', 'plugins/*.js']
      },
      /*
      lib: {
        src: 'lib/*.js'
      },
      */
      test: {
        src: 'tests/**/*.js'
      },
      examples: {
        src: 'examples/*.js'
      }
    },



    less: {
      components: {
        options: {
          ieCompat: false,
          strictMath: true,
          strictUnits: true,
          outputSourceFiles: true,
          sourceMap: true
        },
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['*.less', 'controls/*.less', 'plugins/*.less', 'examples/*.less', '!slick.grid.less', '!slick.config.less', '!slick.config.*.less', '!slick.less.macros.less'],
            dest: 'src',
            ext: '.css'
          }
        ]
      },
      main: {
        options: {
          ieCompat: false,
          strictMath: true,
          strictUnits: true,
          outputSourceFiles: true,
          sourceMap: true
        },
        files: [
          {
            cwd: '',
            expand: false,
            src: 'src/slick.grid.less',
            dest: 'src/slick.grid.css'
          }
        ]
      }
    },

    autoprefixer: {
        options: {
            browsers: ['last 2 versions']
        },
        dist: {
            files: {
                '*.css': ['tmp/*.css']
            }
        }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            'slick.grid.css',
            'slick-default-theme.css'
          ]
        }
      }
    },

    csscomb: {
      sort: {
        options: {
          config: '.csscomb.json'
        },
        files: {
          'slick.grid.css': 'slick.grid.css',
          'slick-default-theme.css': 'slick-default-theme.css'
        }
      }
    },

    copy: {
      app_files : {
        files: [
          {
            expand: true,       // `mkdir -p` equivalent
            cwd: 'src/',

            src: [
              'slick*.js',
               'controls/*.js',
               'controls/*.css',
              'plugins/*.js',
              'plugins/*.css'
            ],
            flatten: false,      // ensures tinycolor.js, etc. all land in lib/_/ *sans subdirectory*
            dest: 'dist/',
            filter: 'isFile'
          }]

      },
      cssFiles :{
        files: [
          {
            expand: true,       // `mkdir -p` equivalent
            cwd: 'src/',

            src: [
              'slick.grid.css',
              'slick-default-theme.css'
            ],
            flatten: true,
            dest: 'dist/',
            filter: 'isFile'
          }]

      },
      // synchronize library files in submodules to lib/_/
      libsync: {
        files: [
          {
            expand: true,       // `mkdir -p` equivalent
            cwd: 'src/',
            src: [
              'lib/*.js'
            ],

            flatten: true,      // ensures tinycolor.js, etc. all land in lib/_/ *sans subdirectory*
            dest: 'dist/lib/',
            filter: 'isFile'
          }
        ]
      },
       bowerlibPlugins: {
        files: [
          {
            expand: true,       // `mkdir -p` equivalent
            cwd: 'bower_components/',
            src: [
                 'SlickGrid.spreadsheet-plugins/*.js',
                  'SlickGrid.spreadsheet-plugins/*.css',
            ],
            flatten: true,      // ensures tinycolor.js, etc. all land in lib/_/ *sans subdirectory*
            dest: 'dist/plugins/',
            filter: 'isFile'
          }
        ]
      },
      bowerlib: {
        files: [
          {
            expand: true,       // `mkdir -p` equivalent
            cwd: 'bower_components/',
            src: [
              'jquery/dist/jquery*.js',
              'jquery-ui/jquery*.js',
              'jquery.dragdrop/event.drag/jquery.event.drag*.js',
              'jquery.dragdrop/event.drop/jquery.event.drop*.js',
              'spectrum/spectrum.*', '!spectrum/spectrum.*.json',
              //'TinyColor/tinycolor.js',
              //'verge-screendimensions/verge.js',
              //'jquery-sparkline/dist/jquery.sparkline.js',
              //'jquery-simulate/jquery.simulate.js',
              'jquery-multiselect/jquery.multiselect.*',
              'jquery-multiselect/src/jquery.multiselect.js',
              'jquery-multiselect/src/jquery.multiselect.filter.js',
              'lodash/lodash.js'
            ],
            flatten: true,      // ensures tinycolor.js, etc. all land in lib/_/ *sans subdirectory*
            dest: 'dist/lib/',
            filter: 'isFile'
          }
        ]
      },

      images: {
        files: [
          {
            expand: true,       // `mkdir -p` equivalent
            cwd: 'src/',
            src: [
              'images/*.*'
            ],

            flatten: true,      // ensures tinycolor.js, etc. all land in lib/_/ *sans subdirectory*
            dest: 'dist/images/',
            filter: 'isFile'
          }
        ]
      },
      // ---
      // copy fonts, etc. to the `dist/` output directory
      fonts: {
        expand: true,
        src: 'fonts/*',
        dest: 'dist/'
      },
      docs: {
        expand: true,
        cwd: './dist',
        src: [
          '{css,js}/*.min.*',
          'css/*.map',
          'fonts/*'
        ],
        dest: 'docs/dist'
      }
    },

    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: 'tests/**/*.html'
    }
  });


  // Load all files starting with `grunt-`
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Preparation task: synchronize the libraries (lib/*) from the submodules.
  grunt.registerTask('deploy', ['compile','copy:app_files', 'copy:cssFiles', 'copy:images']);

  grunt.registerTask('libsync', ['copy:libsync','copy:bowerlib','copy:bowerlibPlugins']);

  // Preparation (compile) task.
  grunt.registerTask('compile', ['clean', 'libsync', 'less']);

  // Lint task.
  grunt.registerTask('lint', ['csslint', 'jshint', 'jscs']);

  // Test task.
  grunt.registerTask('test', ['compile', 'lint', 'qunit']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['compile', /*'cssmin',*/ 'csscomb', 'usebanner']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css']);

  // Default task.
  grunt.registerTask('default', ['test', 'dist']);
};
