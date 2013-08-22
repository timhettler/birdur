birdur.directive('installPrompt', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/install.html'
  }
});

birdur.directive('spinner', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      var opts = {
        lines: parseInt(attrs.lines) || 13, // The number of lines to draw
        length: parseInt(attrs["length"]) || 4, // The length of each line
        width: parseInt(attrs.width) || 2, // The line thickness
        radius: parseInt(attrs.radius) || 4, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: attrs.color || '#000', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
      };
      var spinner = new Spinner(opts).spin(element[0]);
    }
  };
});

birdur.directive('disableTouch', function () {
  return function (scope, element) {

    if (!Modernizr.touch) { return; }

    var isTouchAllowed = function($elem) {
      while ($elem[0] !== element[0]) {
        if ($elem.hasClass('allow-touch')) {
          return true;
        }
        $elem = $elem.parent();
      }
      return false;
    }

    Hammer(element[0])
      .on("dragstart tap", function (e) {
        if(!isTouchAllowed(angular.element(e.target))) {
          e.gesture.preventDefault();
        }
      });
  };
});

birdur.directive('hammerDrag', function () {
  return function (scope, element) {

    if (!Modernizr.touch) { return; }

    var getTransform = function(el) {
            var transform = window.getComputedStyle(el, null).getPropertyValue('-webkit-transform');
            var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);

            if(!results) return [0, 0, 0];
            if(results[1] == '3d') return results.slice(2,5);

            results.push(0);
            return results.slice(5, 8); // returns the [X,Y,Z,1] values
        },
        toggleView = function (y) {
          setYValue(y);
          $dragTarget
            .removeClass('is-dragging')
            .toggleClass('is-up', y === maxY);
        },
        setYValue = function (y) {
          dragTarget.style.webkitTransform = 'translate3d(0, '+y+ 'px, 1px)';
          setSearchClass(y);
        },
        setSearchClass = function (y) {
          $searchBar.toggleClass('is-hidden', y !== minY);
        }
        dragTarget = document.querySelector('.hotspot-container'),
        $dragTarget = angular.element(dragTarget),
        $searchBar = angular.element(document.querySelector('.map-search')),
        minY = -64,
        maxY = dragTarget.offsetHeight * -1,
        startY = parseInt(getTransform(dragTarget)[1]),
        dir = null;

    Hammer(element[0])
      .on("dragstart", function (e) {
        startY = parseInt(getTransform(dragTarget)[1]);
        $dragTarget.addClass('is-dragging');
        e.gesture.preventDefault();
      })
      .on("drag", function (e) {
        var ey = parseInt(e.gesture.deltaY) + startY,
            y = (ey > minY) ? minY : (ey < maxY) ? maxY : ey;

        setYValue(y);
        e.gesture.preventDefault();
      })
      .on("tap", function (e) {
        if (angular.element(e.target).hasClass('hotspot-directions-icon')) { return false; }

        var curY = parseInt(getTransform(dragTarget)[1]),
            y = (curY >= minY) ? maxY : minY;

        toggleView(y);
        e.gesture.preventDefault();
      })
      .on("dragend", function (e) {
        var g = e.gesture,
            finalY = (g.direction === "up") ? maxY : minY;

        toggleView(finalY);
      });
  };
});

