module.exports = function ( grunt ) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-contrib-compass');

  var userConfig = require( './build.config.js' );

  var taskConfig = {

    pkg: grunt.file.readJSON("package.json"),

    htmlbuild: {
      build: {
        src: 'src/index.html',
        dest: '<%= build_dir %>',
        options: {
          beautify: true,
          scripts: {
            bundle: [
              '<%= vendor_files.js %>',
              '<%= build_dir %>/src/**/*.js',
              '<%= html2js.app.dest %>'
            ]
          },
          styles: {
            bundle: [
              '<%= build_dir %>/css/app.css'
            ]
          },
          data: {
              version: "<%= pkg.version %>",
              title: "<%= pkg.name %>",
              description: "<%= pkg.description %>"
          },
        }
      }
    },

    clean: [
      '<%= build_dir %>',
      '<%= compile_dir %>'
    ],

    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: [ '<%= app_files.atpl %>' ],
        dest: '<%= build_dir %>/templates-app.js'
      }
    },

    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },

    compass: {
      dist: {
        options: {
          force: true,
          environment: 'production'
        }
      },
      dev: {
        options: {
          force: true,
          cssDir: 'build/css',
          imagesDir: 'build/assets',
          environment: 'development'
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
            src: [ '<%= app_files.js %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
      build_vendorjs: {
        files: [
          {
            src: [ '<%= vendor_files.js %>' ],
            dest: '<%= build_dir %>/',
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
    }

  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  grunt.registerTask('build', [
    'clean', 'html2js',
    'copy:build_assets', 'copy:build_appjs', 'copy:build_vendorjs',
    'compass:dev', 'htmlbuild:build'
  ]);
};