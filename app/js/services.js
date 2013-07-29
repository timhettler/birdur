'use strict';

/* Services */

birdur.factory('Map', function (){

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