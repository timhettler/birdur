'use strict';

/* Services */

birdur.factory('UserInput', function ($q, $log, LocationService) {
  var regex_latLng = /^(-?\d{1,3}(\.\d*)?),\s?(-?\d{1,3}(\.\d*)?)$/,
      regex_whitespace = /\s+/g,
      regex_zipcode = /^\d{5}(-\d{4})?$/g,
      regex_address = /^(.*)?(\w+)?(,?\s?)?(\w)+(,\s?)(\w)+/,
      regex_addressSeparator = /,\s?/;

  var formatQuery = function (searchString) {
    var query = null;
    searchString = searchString
              .trim()
              .replace(regex_whitespace, ' ')
              .toLowerCase();

    if(regex_zipcode.test(searchString)) {

      query = "[zip="+searchString+"][country=United States]";

    } else if(regex_address.test(searchString)) {

      var address = searchString.split(regex_addressSeparator);

      if(address.length == 1) {

        query = "[city="+address[0]+"][country=United States]";

      } else if(address.length == 2) {

        query = "[city="+address[0]+"][state="+address[1]+"][country=United States]";

      }
      else if(address.length == 3) {

        query = "[street="+address[0]+"][city="+address[1]+"][state="+address[2]+"][country=United States]";

      }
      else if(address.length == 4) {

        query = "[housenumber="+address[0]+"][street="+address[1]+"][city="+address[2]+"][state="+address[3]+"][country=United States]";

      }
    } else {
      query = "[sight="+searchString+"][country=United States]";
    }

    $log.log(query);
    return query;
  };

  var isLatLng = function (searchString) {
    if(regex_latLng.test(searchString)) {
      return true;
    }
    return false;
  };

  var getLatLng = function (searchString) {
    var defer = $q.defer();
    if(isLatLng(searchString)) {
      defer.resolve(searchString.split(','));
    } else {
      LocationService.geosearch({
        q: formatQuery(searchString)
      }, function (data) {
        if(data.places) {
          $log.log(data);
          var coords = data.places[0].position;
          defer.resolve([coords.lat,coords.lon]);
        } else {
          defer.reject();
        }
      }, function (data) {
        defer.reject();
      });
    }

    return defer.promise;
  };

  return {
    getLatLng: getLatLng
  }
});

birdur.factory('Map', function ($log){

  var map = L.map('map'),
      mapMarkers = L.layerGroup(),
      curLoc = L.circle(),
      init = function () {
        L.tileLayer('http://{s}.tile.cloudmade.com/badf2c8f27664349b206f901bdaa58ea/96931/256/{z}/{x}/{y}.png', {
          maxZoom: 18
        }).addTo(map);
      },
      setView = function (latlng) {
        map.setView(latlng, 12);
      },
      setMarker = function (latlng, popup) {
        var marker = L.marker(latlng)
                      .on('click', markerFocus)
                      .bindPopup(popup);
        mapMarkers.addLayer(marker);
        return marker;
      },
      focusMarker = function (id) {
        var marker = mapMarkers.getLayer(id),
            pos = marker.getLatLng();

        map.invalidateSize();
        map.panTo([pos.lat, pos.lng]);
        marker.openPopup();
        return false;
      },
      markerFocus = function (e) {
        $log.log(e.target._leaflet_id);
      };

  return {
      map: map,
      mapMarkers: mapMarkers,
      init: init,
      setView: setView,
      setMarker: setMarker,
      focusMarker: focusMarker
  };
});

birdur.factory('GeoLoc', function ($q, $rootScope){

  var apply = function () {
    $rootScope.$apply();
  };

  var locate = function () {
    var defer = $q.defer();
    navigator.geolocation.getCurrentPosition(
      function (position) {
        defer.resolve(position);
        apply();
      },
      function(error) {
        defer.reject(error);
        apply();
      });
    return defer.promise;
  };

  return {
      locate: locate
  };

});

birdur.factory('LocationService', function($resource) {
  return $resource(
    'http://beta.geocoding.cloudmade.com/v3/8ee2a50541944fb9bcedded5165f09d9/api/geo.location.search.2',
    {
      callback: 'JSON_CALLBACK',
      format: 'json',
      source: 'OSM',
      enc: 'UTF-8'
    },
    {
      geosearch : {
        method: 'JSONP',
        params: {
          q: '@q'
        }
      }
    }
  );
});

birdur.factory('eBird', function($resource) {
  return $resource(
    'http://ebird.org/ws1.1/ref/hotspot/:type?lng=:longitude&lat=:latitude&fmt=:fmt&back=:back&callback=:callback',
    {
      longitude: '@longitude',
      latitude: '@latitude',
      fmt: 'json',
      back: '30',
      callback: 'JSON_CALLBACK'
    },
    {
      geo: {
        method:'JSONP',
        params:{type: 'geo'},
        isArray: true
      }
    }
  );
});