'use strict';

/* Controllers */

birdur.controller('SplashCtrl', function ($scope, $location, UserInput, GeoLoc, LocationService) {
  GeoLoc.locate()
    .then(function (position) {
      $location.path('/map/'+position.coords.latitude+','+position.coords.longitude);
    });

  $scope.searchString = null;
  $scope.submitted = false;
  $scope.errorMessage = null;

  $scope.handleUserInput = function () {
    $scope.submitted = true;
    $scope.errorMessage = null;
    UserInput.getLatLng($scope.searchString)
      .then(function(latLng) {
        $location.path('/map/'+latLng.join());
      }, function() {
        $scope.submitted = false;
        $scope.errorMessage = "That search didn't return any results. Did you spell it right?";
      });
  };
});

birdur.controller('HotspotsListCtrl', function ($scope, $http, $log, $routeParams, $location, UserInput, GeoLoc, eBirdRef, eBirdObs, LocationService) {

  $scope.origin = {};
  $scope.errorMessage = "";
  $scope.currentHotspot = null;
  //Map defaults
  $scope.center = {
    zoom: 12
  };
  $scope.markers = {};
  $scope.mapDefaults = {
      tileLayer: 'http://{s}.tile.cloudmade.com/badf2c8f27664349b206f901bdaa58ea/96931/256/{z}/{x}/{y}.png',
      tileLayerOptions: {
        attribution: ''
      },
      minZoom: 10,
  };

  $scope.setMarkers = function(hotspots) {
    if(!hotspots || hotspots.length < 1) { return; }

    for (var i = 0; i < hotspots.length; i++) {
      var spot = hotspots[i];

      $scope.markers[i] = {
        lat: spot.lat,
        lng: spot.lng,
        events: {
          click: function() {
            console.log($scope.markers);
            $scope.focusMarker(this.name);
          }
        }
      }
    };

  };

  $scope.focusMarker = function(id) {
    var marker = $scope.markers[id];

    angular.forEach($scope.markers, function(m){
      m.focus = false;
    });

    marker.focus = true;
    $scope.center.lat = marker.lat;
    $scope.center.lng = marker.lng;

    $scope.getSightingSummary(id);
  };

  $scope.handleLocationData = function(lat, lng) {

    $scope.center.lat = lat;
    $scope.center.lng = lng;

    eBirdRef.geo({lat: $scope.center.lat, lng: $scope.center.lng}, function(data){
      // angular.forEach(data, function(key){
      //   key.locName = key.locName.replace('--','<br/>');
      // });
      $scope.hotspots = data;
      $scope.setMarkers($scope.hotspots);
    });
  };

  $scope.getSightingSummary = function(id) {
    $scope.currentHotspot = $scope.hotspots[id];
    $log.log($scope.currentHotspot);
    eBirdObs.summary({r: $scope.currentHotspot.locID}, function(data){
      $scope.currentHotspot.sightings = data;
    });
  }

  $scope.GeoLocate = function () {
    GeoLoc.locate()
      .then(function (position) {
        $scope.handleLocationData(position.coords.latitude,position.coords.longitude);
      }, function () {
        $scope.errorMessage = "<p>We can't determine where you are!</p><p>Try again when you have a better internet connection.</p>";
      });
  };

  UserInput.getLatLng($routeParams.query)
    .then(function(latLng){
      $scope.origin.lat = latLng[0];
      $scope.origin.lng = latLng[1];
      $scope.handleLocationData(latLng[0], latLng[1]);
      $location.replace('/map/'+latLng.join());
    }, function(){
      $location.replace('/');
    });
});