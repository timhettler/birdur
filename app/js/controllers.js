'use strict';

/* Controllers */

birdur.controller('InstallCtrl', function ($location, Install) {
  if(!Install.requiresInstall()) {
    $location.path('/');
  }
});

birdur.controller('SplashCtrl', function ($scope, $location, UserInput, GeoLoc, LocationService, Install) {

  if(Install.requiresInstall()) {
    $location.path('/install/');
    return;
  }

  GeoLoc.locate()
    .then(function (position) {
      $location.path('/map/'+position.coords.latitude+','+position.coords.longitude);
    }, function () {
      $scope.noGeo = true;
    });

  $scope.noGeo = false;
  $scope.showInstallScreen = !!navigator.userAgent.match(/(iPad|iPhone|iPod)/g) && !window.navigator.standalone;
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

birdur.controller('HotspotsListCtrl', function ($scope, $http, $log, $routeParams, $location, UserInput, GeoLoc, eBirdRef, eBirdObs, LocationService, Install) {
  if(Install.requiresInstall()) {
    $location.path('/install/');
    return;
  }

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
      minZoom: 8,
  };

  $scope.setMarkers = function(hotspots) {
    if(!hotspots || hotspots.length < 1) { return; }

    for (var i = 0; i < hotspots.length; i++) {
      var spot = hotspots[i];

      $scope.markers[i] = {
        lat: spot.lat,
        lng: spot.lng
      }
    };

    $scope.focusMarker(0);
  };

  $scope.$on('leafletDirectiveMarker.click', function(e, data){
    $scope.focusMarker(parseInt(data.markerName));
  });


  $scope.focusMarker = function(id) {
    var marker = $scope.markers[id];

    if($scope.currentHotspot) {
      if($scope.currentHotspot.markerID === id) { return; }
      $scope.markers[$scope.currentHotspot.markerID].focus = false;
      $scope.currentHotspot = null;
    }

    $scope.currentHotspot = $scope.hotspots[id];
    $scope.currentHotspot.markerID = id;

    marker.focus = true;
    $scope.center.lat = marker.lat;
    $scope.center.lng = marker.lng;

    $log.log($scope.currentHotspot.sightings);

    if(!$scope.currentHotspot.sightings) {
      $scope.getSightingSummary(id);
    }
  };

  $scope.getSightingSummary = function(id) {
    eBirdObs.summary({r: $scope.currentHotspot.locID}, function(data){
      $scope.hotspots[id].sightings = $scope.currentHotspot.sightings = data;
    });
  };

  $scope.handleLocationData = function(lat, lng) {

    $scope.center.lat = lat;
    $scope.center.lng = lng;

    eBirdRef.geo({lat: $scope.center.lat, lng: $scope.center.lng}, function(data){
      angular.forEach(data, function(key){
        var name = key.locName.split('--');
        key.mainLoc = (name.length === 1) ? name[0] : name[1];
        key.subLoc = (name.length > 1) ? name[0] : null;
      });
      $scope.hotspots = data;
      $scope.setMarkers($scope.hotspots);
    });
  };

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