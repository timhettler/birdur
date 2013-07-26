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