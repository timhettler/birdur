'use strict';

/* Routes */

birdur.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/splash.html',
      controller: 'SplashCtrl'
    })
    .when('/install', {
      templateUrl: 'templates/install.html',
      controller: 'InstallCtrl'
    })
    .when('/map/:query', {
      templateUrl: 'templates/map.html',
      controller: 'HotspotsListCtrl'
    })
    .otherwise({
      redirectTo: "/"
    });

  //$locationProvider.html5Mode(true);
})