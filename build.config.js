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
                'components/angular/angular.js',
                'components/angular-leaflet-directive/src/angular-leaflet-directive.js',
                'components/angular-resource/angular-resource.js',
                'components/angular-route/angular-route.js',
                'components/fastclick/lib/fastclick.js',
                'components/hammerjs/dist/hammer.js',
                'components/modernizr/modernizr.js',
                'components/scrollfix/scrollfix.js',
                'components/spinjs/dist/spin.js'
            ],
        css: []
    },
};