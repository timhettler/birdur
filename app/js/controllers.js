'use strict';

/* Controllers */

function HotspotsListCtrl($scope, GeoLoc, eBird, LocationService) {

  $scope.position = null;
  $scope.errorMessage = "";
  $scope.locationName = "Local";

  $scope.setMarkers = function(hotspots) {
    if(!hotspots || hotspots.length < 1) { return; }

    $scope.removeMarkers();

    for (var i = 0; i < hotspots.length; i++) {
      var spot = hotspots[i],
        marker = L.marker([spot.lat, spot.lng])
          .bindPopup('<b>'+spot.locName+'</b><br/><a href="https://maps.google.com/maps?saddr='+$scope.position.latitude+', '+$scope.position.longitude+'&daddr='+spot.lat+', '+spot.lng+'" target="_blank">Get directions</a>');

        mapMarkers.addLayer(marker).addTo(map);
    };
  };

  $scope.removeMarkers = function () {
    mapMarkers.clearLayers();
  }

  $scope.parseLocName = function(locName) {
    var names = locName.split('--'),
        newName = locName;
    if(names[1]) {
      newName = names[1]+"<i>"+names[0]+"</i>";
    }
    return newName;
  };

  $scope.focusMarker = function(i) {
    var marker = mapMarkers[i],
      pos = marker.getLatLng();

    map.invalidateSize();
    map.panTo([pos.lat, pos.lng]);
    marker.openPopup();
    return false;
  };

  $scope.handleLocationData = function(lat, lng) {

    $scope.position = {
      latitude: lat,
      longitude: lng
    };

    map.setView([$scope.position.latitude, $scope.position.longitude], 11);

    eBird.geo($scope.position, function(data){
      angular.forEach(data, function(key){
        key.locName = key.locName.replace('--','<br/>');
      });
      $scope.hotspots = data;
      $scope.setMarkers($scope.hotspots);
    });

    LocationService.geosearch({
      q: $scope.position.latitude+","+$scope.position.longitude
    }, function (data) {
      console.log(data);
      $scope.locationName = data.places[0].city;
    });
  };

  $scope.handleUserInput = function(query) {
    var regex_latLng = /^(-?\d{1,2}(\.\d*)?),\s?(-?\d{1,2}(\.\d*)?)$/,
        regex_whitespace = /\s+/g,
        regex_zipcode = /^\d{5}(-\d{4})?$/g,
        regex_address = /^(.*)?(\w+)?(,?\s?)?(\w)+(,?\s?)(\w)+/,
        regex_addressSeparator = /,\s?/,
        geosearchQuery = null;

    if(!query) {
      query = $scope.locationName;
    }

    query = query
              .trim()
              .replace(regex_whitespace, ' ')
              .toLowerCase();

    if(regex_latLng.test(query)) {
      $scope.handleLocationData.apply(this, query.split(','));
    } else {

      if(regex_zipcode.test(query)) {
        geosearchQuery = "[zip="+query+"]";
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
          var coords = data.places[0].position;
          $scope.handleLocationData(coords.lat, coords.lon);
        });
      }
    }
  }

  GeoLoc.locate()
    .then(function (position) {
      $scope.handleLocationData(position.coords.latitude, position.coords.longitude);
    }, function () {
      $scope.errorMessage = "<p>We can't determine where you are!</p><p>Try again when you have a better internet connection.</p>";
      map.setView([43.236406, -76.225033], 9);
    });
};