'use strict';

/* Routes */

birdur.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/splash.html',
      controller: 'SplashCtrl'
    })
    .when('/map/:query', {
      templateUrl: 'templates/map.html',
      controller: 'HotspotsListCtrl'
    })
    .otherwise({
      redirectTo: "/"
    })
})