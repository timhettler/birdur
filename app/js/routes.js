'use strict';

/* Routes */

birdur.config(function ($routeProvider) {
  $routeProvider
    .when('/:query', {
      templateUrl: 'templates/map.html',
      controller: 'HotspotsListCtrl'
    })
})