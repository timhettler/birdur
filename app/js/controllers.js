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

birdur.controller('HotspotsListCtrl', function ($scope, $log, $routeParams, $location, UserInput, Map, GeoLoc, eBird, LocationService) {

  var map = Map.map,
      mapMarkers = Map.mapMarkers;

  Map.init();

  $scope.position = {
    latitude: null,
    longitude: null,
    name: null
  }
  $scope.errorMessage = "";
  $scope.selectedHotspotId = null;

  console.log($scope);

  $scope.setMarkers = function(hotspots) {
    if(!hotspots || hotspots.length < 1) { return; }

    mapMarkers.clearLayers();

    for (var i = 0; i < hotspots.length; i++) {
      var spot = hotspots[i];

      spot.id = Map.setMarker(
        [spot.lat, spot.lng],
        '<b>'+spot.locName+'</b><br/><a href="https://maps.google.com/maps?saddr='+$scope.position.latitude+', '+$scope.position.longitude+'&daddr='+spot.lat+', '+spot.lng+'" target="_blank">Get directions</a>'
      )._leaflet_id;
    };
    mapMarkers.addTo(map);
  };

  $scope.parseLocName = function(locName) {
    var names = locName.split('--'),
        newName = locName;
    if(names[1]) {
      newName = names[1]+"<i>"+names[0]+"</i>";
    }
    return newName;
  };

  $scope.focusMarker = function(id) {
    return Map.focusMarker(id);
  };

  $scope.handleLocationData = function(lat, lng) {

    $scope.position = {
      latitude: lat,
      longitude: lng
    };

    Map.setView([$scope.position.latitude, $scope.position.longitude]);

    eBird.geo($scope.position, function(data){
      angular.forEach(data, function(key){
        key.locName = key.locName.replace('--','<br/>');
      });
      $scope.hotspots = data;
      $scope.setMarkers($scope.hotspots);
    });

    // LocationService.geosearch({
    //   q: "[latitude="+$scope.position.latitude+"][longitude="+$scope.position.longitude+"]"
    // }, function (data) {
    //   console.log(data);
    //   var place = data.places[0].city || data.places[0].name || data.places[0].zip,
    //       state = data.places[0].state || '';
    //   $scope.position.name = place.replace('~','') + ', ' + state.replace(/\./g,'').toUpperCase();
    // });
  };

  $scope.GeoLocate = function () {
    GeoLoc.locate()
      .then(function (position) {
        $scope.handleLocationData(position.coords.latitude,position.coords.longitude);
      }, function () {
        $scope.errorMessage = "<p>We can't determine where you are!</p><p>Try again when you have a better internet connection.</p>";
      });
  }

  UserInput.getLatLng($routeParams.query)
    .then(function(latLng){
      $scope.handleLocationData(latLng[0], latLng[1]);
      $location.replace('/map/'+latLng.join());
    }, function(){
      $location.replace('/');
    });
});