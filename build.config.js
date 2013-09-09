module.exports = {

    build_dir: 'build',
    compile_dir: 'bin',

    app_files: {
        js: ['src/js/*.js'],
        atpl: [ 'src/templates/*.tpl.html' ],
        html: ['src/index.html'],
    },

    vendor_files: {
        js: [
                'bower_components/angular/angular.js',
                'bower_components/angular-leaflet-directive/src/angular-leaflet-directive.js',
                'bower_components/angular-resource/angular-resource.js',
                'bower_components/angular-route/angular-route.js',
                'bower_components/fastclick/lib/fastclick.js',
                'bower_components/hammerjs/dist/hammer.js',
                'bower_components/modernizr/modernizr.js',
                'bower_components/scrollfix/scrollfix.js',
                'bower_components/spinjs/dist/spin.js'
            ],
        css: []
    },
};