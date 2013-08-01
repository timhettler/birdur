'use strict';

/* Controllers */

birdur.controller('SplashCtrl', function ($scope, $location, GeoLoc, LocationService) {
  GeoLoc.locate()
    .then(function (position) {
      $location.path('/map/'+position.coords.latitude+','+position.coords.longitude);
    });

  $scope.handleUserInput = function(query) {
    var regex_latLng = /^(-?\d{1,3}(\.\d*)?),\s?(-?\d{1,3}(\.\d*)?)$/,
        regex_whitespace = /\s+/g,
        regex_zipcode = /^\d{5}(-\d{4})?$/g,
        regex_address = /^(.*)?(\w+)?(,?\s?)?(\w)+(,?\s?)(\w)+/,
        regex_addressSeparator = /,\s?/,
        geosearchQuery = null;

    if(!query) {
      query = $scope.searchQuery;
    }

    query = query
              .trim()
              .replace(regex_whitespace, ' ')
              .toLowerCase();

    if(regex_latLng.test(query)) {
      $scope.handleLocationData.apply(this, query.split(','));
    } else {

      if(regex_zipcode.test(query)) {
        geosearchQuery = "[zip="+query+"][country=United States]";
      } else if(regex_address.test(query)) {
        var address = query.split(regex_addressSeparator);
        if(address.length == 1) {
          geosearchQuery = "[city="+address[0]+"][country=United States]";
        } else if(address.length == 2) {
          geosearchQuery = "[city="+address[0]+"][state="+address[1]+"][country=United States]";
        }
        else if(address.length == 3) {
          geosearchQuery = "[street="+address[0]+"][city="+address[1]+"][state="+address[2]+"][country=United States]";
        }
        else if(address.length == 4) {
          geosearchQuery = "[housenumber="+address[0]+"][street="+address[1]+"][city="+address[2]+"][state="+address[3]+"][country=United States]";
        }
      }

      if(geosearchQuery) {
        console.log(geosearchQuery);
        LocationService.geosearch({
          q: geosearchQuery
        }, function (data) {
          if(data.places) {
            var coords = data.places[0].position;
            $location.path('/map/'+coords.lat+','+coords.lon);
          } else {
            //TODO
          }
        });
      }
    }
  };
});

birdur.controller('HotspotsListCtrl', function ($scope, $routeParams, $location, Map, GeoLoc, eBird, LocationService) {

  var map = Map.map,
      mapMarkers = Map.mapMarkers;

  Map.init();

  $scope.position = {
    latitude: null,
    longitude: null,
    name: null
  }
  $scope.errorMessage = "";
  $scope.searchQuery = $routeParams.query;
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

    //$location.path('/map/'+$scope.position.latitude+','+$scope.position.longitude);

    eBird.geo($scope.position, function(data){
      angular.forEach(data, function(key){
        key.locName = key.locName.replace('--','<br/>');
      });
      $scope.hotspots = data;
      $scope.setMarkers($scope.hotspots);
    });

    LocationService.geosearch({
      q: "[latitude="+$scope.position.latitude+"][longitude="+$scope.position.longitude+"]"
    }, function (data) {
      console.log(data);
      var place = data.places[0].city || data.places[0].name || data.places[0].zip,
          state = data.places[0].state || '';
      $scope.position.name = place.replace('~','') + ', ' + state.replace(/\./g,'').toUpperCase();
    });
  };

  $scope.handleUserInput = function(query) {
    var regex_latLng = /^(-?\d{1,3}(\.\d*)?),\s?(-?\d{1,3}(\.\d*)?)$/,
        regex_whitespace = /\s+/g,
        regex_zipcode = /^\d{5}(-\d{4})?$/g,
        regex_address = /^(.*)?(\w+)?(,?\s?)?(\w)+(,?\s?)(\w)+/,
        regex_addressSeparator = /,\s?/,
        geosearchQuery = null;

    if(!query) {
      query = $scope.searchQuery;
    }

    query = query
              .trim()
              .replace(regex_whitespace, ' ')
              .toLowerCase();

    if(regex_latLng.test(query)) {
      $scope.handleLocationData.apply(this, query.split(','));
    } else {

      if(regex_zipcode.test(query)) {
        geosearchQuery = "[zip="+query+"][country=United States]";
      } else if(regex_address.test(query)) {
        var address = query.split(regex_addressSeparator);
        if(address.length == 1) {
          geosearchQuery = "[city="+address[0]+"][country=United States]";
        } else if(address.length == 2) {
          geosearchQuery = "[city="+address[0]+"][state="+address[1]+"][country=United States]";
        }
        else if(address.length == 3) {
          geosearchQuery = "[street="+address[0]+"][city="+address[1]+"][state="+address[2]+"][country=United States]";
        }
        else if(address.length == 4) {
          geosearchQuery = "[housenumber="+address[0]+"][street="+address[1]+"][city="+address[2]+"][state="+address[3]+"][country=United States]";
        }
      }

      if(geosearchQuery) {
        console.log(geosearchQuery);
        LocationService.geosearch({
          q: geosearchQuery
        }, function (data) {
          if(data.places) {
            var coords = data.places[0].position;
            $scope.handleLocationData(coords.lat, coords.lon);
          } else {
            $scope.errorMessage = "<p>We can't determine where you are!</p><p>Try again when you have a better internet connection.</p>";
          }
        });
      }
    }
  };

  $scope.GeoLocate = function () {
    GeoLoc.locate()
      .then(function (position) {
        $scope.handleUserInput(position.coords.latitude+','+position.coords.longitude);
      }, function () {
        $scope.errorMessage = "<p>We can't determine where you are!</p><p>Try again when you have a better internet connection.</p>";
      });
  }

  if($scope.searchQuery) {
    $scope.handleUserInput();
  } else {
    $scope.GeoLocate();
  }
});