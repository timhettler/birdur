birdur.directive('hotspot', function () {
  return {
    scope: {
      name: '@',
      detail: '&'
    },
    restrict: 'E',
    replace: true,
    template: '<div class="hotspot-item" ng-click="detail({i:$index})" ng-bind-html-unsafe="name"></div>'
  }
});

birdur.directive('spinner', function () {
  return {
    restrict: 'E',
    link: function (scope, element) {
      var opts = {
        lines: 13, // The number of lines to draw
        length: 4, // The length of each line
        width: 2, // The line thickness
        radius: 4, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb
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