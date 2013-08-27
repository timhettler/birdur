'use strict';

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
})