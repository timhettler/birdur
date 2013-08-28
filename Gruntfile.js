module.exports = function ( grunt ) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-imageoptim');
  grunt.loadNpmTasks("grunt-modernizr");

  var userConfig = require( './build.config.js' );

  var taskConfig = {

    pkg: grunt.file.readJSON("package.json"),

    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' */\n'
    },

    htmlbuild: {
      build: {
        src: '<%= app_files.html %>',
        dest: '<%= build_dir %>',
        options: {
          parseTag: 'build',
          beautify: true,
          scripts: {
            components: [
              '<%= build_dir %>/js/components/**/*.js',
              '!**/angular.js'
            ],
            angular: '<%= build_dir %>/js/components/angular/angular.js',
            app: [
              '<%= build_dir %>/js/*.js',
              '<%= html2js.app.dest %>'
            ]
          },
          styles: {
            app: '<%= build_dir %>/css/app.css'
          },
          data: {
              version: "<%= pkg.version %>",
              title: "<%= pkg.name %>",
              description: "<%= pkg.description %>"
          },
        }
      },
      compile: {
        src: '<%= build_dir %>/index.html',
        dest: '<%= compile_dir %>',
        options: {
          parseTag: 'compile',
          beautify: true,
          scripts: {
            app: '<%= compile_dir %>/js/*.js'
          },
          styles: {
            app: '<%= compile_dir %>/css/app.css'
          }
        }
      }
    },

    clean: [
      '<%= build_dir %>',
      '<%= compile_dir %>'
    ],

    ngmin: {
      compile: {
        files: [
          {
            src: [ 'js/*.js' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    html2js: {
      app: {
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= build_dir %>/js/templates-app.js'
      }
    },

    jshint: {
      src: '<%= app_files.js %>',
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        eqnull: true,
        browser: true,
        globals: {
          angular: true
        }
      },
    },

    concat: {
      compile_js: {
        src: [
          '<%= vendor_files.js %>',
          '!**/modernizr.js',
          'module.prefix',
          '<%= build_dir %>/js/*.js',
          '<%= vendor_files.js %>',
          'module.suffix'
        ],
        dest: '<%= compile_dir %>/js/<%= pkg.name %>.js'
      }
    },

    delta: {

      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:src', 'copy:build_appjs' ]
      },

      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: [ 'copy:build_assets' ]
      },

      html: {
        files: [ '<%= app_files.html %>' ],
        tasks: [ 'htmlbuild:build' ]
      },

      tpls: {
        files: [
          '<%= app_files.atpl %>'
        ],
        tasks: [ 'html2js' ]
      },

      compass: {
        files: [ 'src/sass/*.scss' ],
        tasks: [ 'compass:dev' ]
      }
    },

    uglify: {
      compile: {
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    compass: {
      dev: {
        options: {
          force: true,
          cssDir: '<%= build_dir %>/css',
          imagesDir: '<%= build_dir %>/assets',
          fontsDir: '<%= build_dir %>/assets/fonts',
          environment: 'development'
        }
      },
      prod: {
        options: {
          force: true,
          cssDir: '<%= compile_dir %>/css',
          imagesDir: '<%= compile_dir %>/assets',
          fontsDir: '<%= compile_dir %>/assets/fonts',
          environment: 'production'
        }
      }
    },

    copy: {
      build_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= build_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
       ]
      },
      build_appjs: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= build_dir %>/js',
            cwd: 'src/js',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>/js',
            cwd: '.',
            expand: true
          }
        ]
      },
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            dest: '<%= compile_dir %>/assets',
            cwd: '<%= build_dir %>/assets',
            expand: true
          }
        ]
      }
    },

    imageoptim: {
      files: ['<%= compile_dir %>/assets'],
      options: {
        imageAlpha: true
      }
    },

    modernizr: {
      devFile: '<%= build_dir %>/js/components/modernizr/modernizr.js',
      outputFile: '<%= build_dir %>/js/modernizr.js',
      files: [
        '<%= build_dir %>/js/*.js',
        '<%= build_dir %>/css/*.css',
      ]
    }

  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'build', 'delta' ] );

  grunt.registerTask( 'default', [ 'build', 'compile' ] );

  grunt.registerTask('build', [
    'clean', 'html2js', 'jshint',
    'copy:build_assets', 'copy:build_appjs', 'copy:build_vendorjs',
    'compass:dev', 'htmlbuild:build'
  ]);

  grunt.registerTask('compile', [
    'copy:compile_assets', 'modernizr',
    'ngmin', 'concat', 'uglify', 'imageoptim',
    'compass:prod', 'htmlbuild:compile'
  ]);
};