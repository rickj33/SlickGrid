

module.exports = function(grunt) {

    // Load the plugin that provides the "uglify" task.
   var _ = require('lodash');
    require('load-grunt-tasks')(grunt);
    // Load required Grunt tasks. These are installed based on the versions listed
    // * in 'package.json' when you do 'npm install' in this directory.
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-coffeelint');

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-express');

    var app_files = {
       
           'lib/jquery.event.drag-2.2.js',
            'lib/jquery.event.drop-2.2.js',
            'slick.core.js',
            'slick.dataview.js',
            'plugins/slick.autotooltips.js',
            'plugins/slick.cellcopymanager.js',
            'plugins/slick.cellexternalcopymanager.js',
            'plugins/slick.cellrangedecorator.js',
            'plugins/slick.cellrangeselector.js',
            'plugins/slick.cellselectionmodel.js',
            'plugins/slick.checkboxselectcolumn.js',

            'slick.editors.js',
            'slick.formatters.js',
            'slick.grid.js'
       
    };
    var cssFiles = {
        css: [
              'slick.grid.css',
    'css/smoothness/jquery-ui-1.8.16.custom.css'

        ]
    };
  

  
    var allFiles = [];
    for(var prop in app_files) {
        if (app_files.hasOwnProperty(prop)) {
            allFiles = allFiles.concat(app_files[prop]);
        }
    }
    for(prop in cssFiles) {
        if (cssFiles.hasOwnProperty(prop)) {
            allFiles = allFiles.concat(cssFiles[prop]);
        }
    }
   
    
    // Project configuration.
    grunt.initConfig({
           build_dir  : 'build',
            compile_dir: 'bin',
        pkg: grunt.file.readJSON('package.json'),
      
       
        uglify: {
            options: {
                banner: '<%= concat.options.banner %>'
            },
            js: {
                files: app_files
            }
        },
       
         clean: {
            files : [
            '<%= build_dir %>',
            '<%= compile_dir %>'
        ]},

        watch: {
            options: {
                debounceDelay: 250
            },
            'default': {
                files: allFiles,
                tasks: [/*'concat:js', 'concat:css',*/ 'less:default']
            },
            minify: {
                files: allFiles,
                tasks: ['uglify:js', /*'concat:css',*/ 'less:minify']
            }
        },

          concat: {
            // The 'build_css' target concatenates compiled CSS and vendor CSS together.
            build_css : {
                src : [
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ],
                dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
            },
            // The 'compile_js' target concatenates app and vendor js code together.
            compile_js: {
                
                src    : [
                    '<%= app_files %>',
                   
                ],
                dest   : '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        /*
        jam: {
            'default': {
                dest: 'compiled.js',
                options: {
                    //package_dir: 'jam_modules',
                    verbose: true,
                    nominify: true,
                    wrap: true
                }
            }
        }
        */
    });



    // Default task(s).
    grunt.registerTask('default', ['concat:compile_js']);
    grunt.registerTask('minify', ['uglify:js', /*'concat:css',*/ 'less:minify']);

    grunt.registerTask('watch-default', ['watch:default']);
    grunt.registerTask('watch-minify', ['watch:minify']);

};