'use strict';

/* Services */

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