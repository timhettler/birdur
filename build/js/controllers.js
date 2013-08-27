'use strict';
birdur.controller('BirdurCtrl', function ($scope, $rootScope, InstallCheck) {
  $rootScope.needsInstall = InstallCheck();
});
birdur.controller('SplashCtrl', function ($scope, $location, UserInput, GeoLoc, Map) {
  $scope.showForm = false;
  $scope.submitted = false;
  $scope.errorMessage = null;
  GeoLoc.locate().then(function (position) {
    $location.path('/map/' + [
      position.coords.latitude,
      position.coords.longitude
    ].join(','));
  }, function () {
    $scope.showForm = true;
  });
  $scope.handleUserInput = function (searchString) {
    $scope.setFormState();
    UserInput.getLatLng(searchString).then(function (latLng) {
      $location.path('/map/' + latLng.join(','));
    }, function () {
      $scope.setFormState('That search didn\'t return any results. Did you spell it right?');
    });
  };
  $scope.setFormState = function (error) {
    if (error) {
      $scope.submitted = false;
      $scope.errorMessage = error;
    } else {
      $scope.submitted = true;
      $scope.errorMessage = null;
    }
  };
});
birdur.controller('HotspotsListCtrl', function ($scope, $http, $log, $location, $routeParams, eBirdRef, eBirdObs, Map, UserInput, GeoLoc) {
  $scope.errorMessage = '';
  $scope.currentHotspot = null;
  $scope.locationName = Map.data.locationName;
  $scope.searchString = $scope.locationName;
  $scope.hotspots = [];
  $scope.mapData = Map.data;
  $scope.markers = {};
  $scope.mapDefaults = {
    tileLayer: 'http://{s}.tiles.mapbox.com/v3/timhettler.map-jws9isw6/{z}/{x}/{y}.png',
    tileLayerOptions: { attribution: '' },
    minZoom: 8
  };
  $scope.init = function () {
    if ($scope.needsInstall) {
      return false;
    }
    if (!$routeParams.query) {
      GeoLoc.locate().then(function (position) {
        $location.path('/map/' + [
          position.coords.latitude,
          position.coords.longitude
        ].join(','));
      }, function () {
        $location.replace().path('/');
      });
    } else {
      var latlng = $routeParams.query.split(',');
      Map.setMapView(latlng[0], latlng[1]);
      $scope.getHotspots();
    }
  };
  $scope.setMarkers = function () {
    if ($scope.hotspots.length < 1) {
      return;
    }
    $scope.markers = {};
    for (var i = 0; i < $scope.hotspots.length; i++) {
      var spot = $scope.hotspots[i];
      $scope.markers[i] = {
        lat: spot.lat,
        lng: spot.lng
      };
    }
    ;
    $scope.focusMarker(0);
  };
  $scope.$on('leafletDirectiveMarker.click', function (e, data) {
    $scope.focusMarker(parseInt(data.markerName));
  });
  $scope.focusMarker = function (id) {
    var marker = $scope.markers[id];
    if ($scope.currentHotspot) {
      if ($scope.currentHotspot.markerID === id) {
        return;
      }
      $scope.markers[$scope.currentHotspot.markerID].focus = false;
      $scope.currentHotspot = null;
    }
    $scope.currentHotspot = $scope.hotspots[id];
    $scope.currentHotspot.markerID = id;
    marker.focus = true;
    $scope.mapData.center.lat = marker.lat;
    $scope.mapData.center.lng = marker.lng;
    if (!$scope.currentHotspot.sightings) {
      $scope.getSightingSummary(id);
    }
  };
  $scope.getSightingSummary = function (id) {
    eBirdObs.summary({ r: $scope.currentHotspot.locID }, function (data) {
      $scope.hotspots[id].sightings = $scope.currentHotspot.sightings = data;
    });
  };
  $scope.getHotspots = function (lat, lng) {
    lat = lat || $scope.mapData.origin.lat;
    lng = lng || $scope.mapData.origin.lng;
    var getDistance = function (latlng1) {
      var R = 6371;
      return Math.acos(Math.sin(latlng1[0]) * Math.sin($scope.mapData.origin.lat) + Math.cos(latlng1[0]) * Math.cos($scope.mapData.origin.lat) * Math.cos($scope.mapData.origin.lng - latlng1[1])) * R;
    };
    $scope.currentHotspot = null;
    eBirdRef.geo({
      lat: lat,
      lng: lng
    }, function (data) {
      angular.forEach(data, function (key) {
        var name = key.locName.split('--');
        key.mainLoc = name.length === 1 ? name[0] : name[1];
        key.subLoc = name.length > 1 ? name[0] : null;
        key.distance = getDistance([
          key.lat,
          key.lng
        ]);
      });
      data.sort(function (d1, d2) {
        return d1.distance - d2.distance;
      });
      $log.log(data.length + ' hotposts found');
      $scope.hotspots = data;
      $scope.setMarkers();
    });
  };
  $scope.handleUserInput = function (searchString) {
    UserInput.getLatLng(searchString).then(function (latLng) {
      $location.path('/map/' + latLng.join());
    });
  };
  $scope.init();
});