'use strict';
birdur.service('Map', function (LocationService) {
  var data = {
      origin: {},
      center: {},
      locationName: null
    }, setMapView = function (lat, lng, name) {
      data.origin.lat = data.center.lat = lat;
      data.origin.lng = data.center.lng = lng;
      data.center.zoom = 10;
      return data;
    }, getOrigin = function () {
      return [
        data.origin.lat,
        data.origin.lng
      ];
    };
  return {
    data: data,
    setMapView: setMapView,
    getOrigin: getOrigin
  };
});
birdur.factory('InstallCheck', function () {
  var isIOS = !!navigator.userAgent.match(/(iPad|iPhone|iPod)/g), isFullscreen = window.navigator.standalone;
  return function () {
    if (isIOS && isFullscreen || !isIOS) {
      return false;
    }
    return true;
  };
});
birdur.factory('UserInput', function ($q, $log, LocationService) {
  var regex_latLng = /^(-?\d{1,3}(\.\d*)?),\s?(-?\d{1,3}(\.\d*)?)$/, regex_whitespace = /\s+/g, regex_zipcode = /^\d{5}(-\d{4})?$/g, regex_address = /^(.*)?(\w+)?(,?\s?)?(\w)+(,\s?)(\w)+/, regex_addressSeparator = /,\s?/;
  var isPark = function (place) {
      var types = [
          'state park',
          'national park',
          'wildlife',
          'conservation'
        ];
      for (var i = 0; i < types.length; i++) {
        if (place.indexOf(types[i]) >= 0) {
          return true;
        }
      }
      return false;
    }, formatQuery = function (searchString) {
      var query = null;
      searchString = searchString.trim().replace(regex_whitespace, ' ').toLowerCase();
      if (regex_zipcode.test(searchString)) {
        query = '[zip=' + searchString + '][country=United States]';
      } else if (regex_address.test(searchString)) {
        var address = searchString.split(regex_addressSeparator);
        if (address.length == 1) {
          var type = isPark(address[0]) ? 'sight' : 'city';
          console.log(isPark(address[0]), address[0]);
          query = '[' + type + '=' + address[0] + '][country=United States]';
        } else if (address.length == 2) {
          var type = isPark(address[0]) ? 'sight' : 'city';
          console.log(isPark(address[0]), address[0]);
          query = '[' + type + '=' + address[0] + '][state=' + address[1] + '][country=United States]';
        } else if (address.length == 3) {
          query = '[street=' + address[0] + '][city=' + address[1] + '][state=' + address[2] + '][country=United States]';
        } else if (address.length == 4) {
          query = '[housenumber=' + address[0] + '][street=' + address[1] + '][city=' + address[2] + '][state=' + address[3] + '][country=United States]';
        }
      } else {
        query = '[sight=' + searchString + '][country=United States]';
      }
      $log.log(query);
      return query;
    };
  var isLatLng = function (searchString) {
    if (regex_latLng.test(searchString)) {
      return true;
    }
    return false;
  };
  var getLatLng = function (searchString) {
    var defer = $q.defer();
    if (!searchString) {
      defer.reject();
    } else if (isLatLng(searchString)) {
      defer.resolve(searchString.split(','));
    } else {
      LocationService.geosearch({ q: formatQuery(searchString) }, function (data) {
        if (data.places) {
          $log.log(data);
          var coords = data.places[0].position;
          defer.resolve([
            coords.lat,
            coords.lon
          ]);
        } else {
          defer.reject();
        }
      }, function (data) {
        defer.reject();
      });
    }
    return defer.promise;
  };
  return { getLatLng: getLatLng };
});
birdur.factory('GeoLoc', function ($q, $rootScope) {
  var apply = function () {
      $rootScope.$apply();
    }, locate = function () {
      var defer = $q.defer();
      navigator.geolocation.getCurrentPosition(function (position) {
        defer.resolve(position);
        apply();
      }, function (error) {
        defer.reject(error);
        apply();
      });
      return defer.promise;
    }, geoAllowed = null;
  return {
    locate: locate,
    geoAllowed: geoAllowed
  };
});
birdur.factory('LocationService', function ($resource) {
  return $resource('http://beta.geocoding.cloudmade.com/v3/8ee2a50541944fb9bcedded5165f09d9/api/geo.location.search.2', {
    callback: 'JSON_CALLBACK',
    format: 'json',
    source: 'OSM',
    enc: 'UTF-8'
  }, {
    geosearch: {
      method: 'JSONP',
      params: { q: '@q' }
    }
  });
});
birdur.factory('eBirdRef', function ($resource) {
  return $resource('http://ebird.org/ws1.1/ref/hotspot/:type', {}, {
    geo: {
      method: 'JSONP',
      params: {
        type: 'geo',
        fmt: 'json',
        callback: 'JSON_CALLBACK',
        dist: 50,
        back: '30',
        lng: '@lng',
        lat: '@lat'
      },
      isArray: true
    }
  });
});
birdur.factory('eBirdObs', function ($resource) {
  return $resource('http://ebird.org/ws1.1/product/obs/hotspot/:type', { r: '@r' }, {
    summary: {
      method: 'JSONP',
      params: {
        type: 'recent',
        fmt: 'json',
        callback: 'JSON_CALLBACK',
        back: '30',
        includeProvisional: 'true'
      },
      isArray: true
    }
  });
});