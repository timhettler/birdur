'use strict';

/* Routes */

birdur.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/map.html',
      controller: 'HotspotsListCtrl'
    })
    .when('/map/:query', {
      templateUrl: 'templates/map.html',
      controller: 'HotspotsListCtrl'
    })
    .otherwise({
      redirectTo: "/"
    })
})