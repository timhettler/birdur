var birdur = angular.module('birdur');
birdur.directive('installPrompt', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/install.tpl.html'
  };
}).directive('spinner', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      var opts = {
          lines: parseInt(attrs.lines) || 13,
          length: parseInt(attrs['length']) || 4,
          width: parseInt(attrs.width) || 2,
          radius: parseInt(attrs.radius) || 4,
          corners: 1,
          rotate: 0,
          direction: 1,
          color: attrs.color || '#000',
          speed: 1,
          trail: 60,
          shadow: false,
          hwaccel: true,
          className: 'spinner',
          zIndex: 2000000000,
          top: 'auto',
          left: 'auto'
        };
      var spinner = new Spinner(opts).spin(element[0]);
    }
  };
}).directive('disableTouch', function () {
  return function (scope, element) {
    if (!Modernizr.touch) {
      return;
    }
    var isTouchAllowed = function ($elem) {
      while ($elem[0] !== element[0]) {
        if ($elem.hasClass('allow-touch')) {
          return true;
        }
        $elem = $elem.parent();
      }
      return false;
    };
    element.bind('touchstart', function (e) {
      if (!isTouchAllowed(angular.element(e.target))) {
        e.preventDefault();
      }
    });
  };
}).directive('hammerDrag', function () {
  return function (scope, element) {
    if (!Modernizr.touch) {
      return;
    }
    var getTransform = function (el) {
        var transform = window.getComputedStyle(el, null).getPropertyValue('-webkit-transform');
        var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);
        if (!results)
          return [
            0,
            0,
            0
          ];
        if (results[1] == '3d')
          return results.slice(2, 5);
        results.push(0);
        return results.slice(5, 8);
      }, toggleView = function (y) {
        setYValue(y);
        $dragTarget.removeClass('is-dragging').toggleClass('is-up', y === maxY);
      }, setYValue = function (y) {
        dragTarget.style.webkitTransform = 'translate3d(0, ' + y + 'px, 1px)';
        setSearchClass(y);
      }, setSearchClass = function (y) {
        $searchBar.toggleClass('is-hidden', y !== minY);
      }, dragTarget = document.querySelector('.hotspot-container'), $dragTarget = angular.element(dragTarget), $searchBar = angular.element(document.querySelector('.map-search')), minY = -64, maxY = dragTarget.offsetHeight * -1, startY = parseInt(getTransform(dragTarget)[1]), dir = null;
    Hammer(element[0]).on('dragstart', function (e) {
      startY = parseInt(getTransform(dragTarget)[1]);
      $dragTarget.addClass('is-dragging');
      e.preventDefault();
      e.gesture.preventDefault();
    }).on('drag', function (e) {
      var ey = parseInt(e.gesture.deltaY) + startY, y = ey > minY ? minY : ey < maxY ? maxY : ey;
      setYValue(y);
      e.preventDefault();
      e.gesture.preventDefault();
    }).on('tap', function (e) {
      if (angular.element(e.target).hasClass('hotspot-directions-icon')) {
        return false;
      }
      var curY = parseInt(getTransform(dragTarget)[1]), y = curY >= minY ? maxY : minY;
      toggleView(y);
      e.preventDefault();
      e.stopPropagation();
    }).on('dragend', function (e) {
      var g = e.gesture, finalY = g.direction === 'up' ? maxY : minY;
      toggleView(finalY);
    });
  };
});