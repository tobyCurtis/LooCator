(function() {
    'use strict';

    angular
        .module('app')
        .directive('resize', resize);

    resize.$inject = ['$window'];

    /* @ngInject */
    function resize($window) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            // bindToController: true,
            // controller: BathroomController,
            // controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs) {

            scope.width = $window.innerWidth;

            angular.element($window).bind('resize', function() {

                scope.width = $window.innerWidth;

                // manuall $digest required as resize event
                // is outside of angular
                scope.$digest();
            });

        }
    }

})();
