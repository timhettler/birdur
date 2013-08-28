(function ( window, document, undefined ) {
'use strict';

var birdur = angular.module('birdur');

/* Routes */

birdur.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/splash.tpl.html',
      controller: 'SplashCtrl'
    })
    .when('/map/:query', {
      templateUrl: 'templates/map.tpl.html',
      controller: 'HotspotsListCtrl'
    })
    .otherwise({
      redirectTo: "/"
    });
});

})( window, document );