angular.module('templates-app', [
  'templates/install.tpl.html',
  'templates/map.tpl.html',
  'templates/splash.tpl.html'
]);
angular.module('templates/install.tpl.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('templates/install.tpl.html', '<div class="install">\n' + '  <div class="install-container">\n' + '    <div class="install-logo"></div>\n' + '    <h1 class="install-title">Install <strong>Birdur</strong></h1>\n' + '    <p>Find the best birding spots, wherever you are.</p>\n' + '    <div class="cta">\n' + '      Tap the icon below to "<b>Add to Home Screen</b>"\n' + '      <div class="icon-arrow">&darr;</div>\n' + '    </div>\n' + '  </div>\n' + '</div>');
  }
]);
angular.module('templates/map.tpl.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('templates/map.tpl.html', '<div class="map-wrapper" ng-class="{\'in-detail\' : currentHotspot}">\n' + '  <leaflet testing="testing" id="map" markers="markers" center="mapData.center" defaults="mapDefaults"></leaflet>\n' + '  <div class="map-search">\n' + '    <form class="map-search-form" name="mapSearch" ng-submit="handleUserInput(searchString)">\n' + '      <div class="map-search-input-container">\n' + '        <input class="map-search-input" name="searchString" ng-model="searchString" type="text" autocorrect="off" required />\n' + '      </div><div class="map-search-button-container">\n' + '        <button name="splashSubmit" class="map-search-button" type="submit">Search</button>\n' + '      </div>\n' + '    </form>\n' + '  </div>\n' + '  <article class="hotspot-container">\n' + '    <header class="hotspot-header" hammer-drag>\n' + '      <div class="hotspot-title">\n' + '        <h1 class="hotspot-title--main">{{currentHotspot.mainLoc}}</h1>\n' + '        <h2 class="hotspot-title--sub">{{currentHotspot.subLoc}}</h2>\n' + '      </div>\n' + '      <div class="hotspot-directions">\n' + '        <a class="hotspot-directions-icon" href="http://maps.apple.com/?saddr={{origin.lat}},{{origin.lng}}&amp;daddr={{currentHotspot.lat}},{{currentHotspot.lng}}" target="_blank">Directions</a>\n' + '      </div>\n' + '    </header>\n' + '    <main class="hotspot-list">\n' + '      <div class="hotspot-item-container allow-touch">\n' + '        <h2 class="hotspot-list-title">Recent Observations</h2>\n' + '        <div ng-repeat="bird in currentHotspot.sightings" class="hotspot-item">{{bird.comName}}</div>\n' + '      </div>\n' + '      <spinner ng-show="!currentHotspot.sightings" class="hotspot-spinner" color="#fff" lines="13" length="20" width="10" radius="30"></spinner>\n' + '    </main>\n' + '  </article>\n' + '  <div class="error-container" ng-show="errorMessage">\n' + '    <div class="error" ng-bind-html-unsafe="errorMessage"></div>\n' + '  </div>\n' + '</div>');
  }
]);
angular.module('templates/splash.tpl.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('templates/splash.tpl.html', '<div class="splash">\n' + '  <div class="splash-container">\n' + '    <div class="splash-logo"></div>\n' + '    <h1 class="splash-title">Birdur</h1>\n' + '    <form class="splash-form" name="splashForm" ng-class="{\'is-visible\': showForm}" ng-submit="handleUserInput(searchString)">\n' + '      <div ng-show="errorMessage" class="splash-error">{{errorMessage}}</div>\n' + '      <div class="splash-input-container">\n' + '        <input ng-disabled="submitted" ng-model="searchString" class="splash-input" name="splashLocation" type="text" placeholder="Where do you want to go birding?" autocorrect="off" required />\n' + '        <spinner class="splash-spinner" ng-show="submitted"></spinner>\n' + '      </div>\n' + '      <button ng-disabled="submitted" name="splashSubmit" class="splash-submit" type="submit">Submit</button>\n' + '    </form>\n' + '  </div>\n' + '</div>');
  }
]);