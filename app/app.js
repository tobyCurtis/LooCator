(function() {
    'use strict';

    angular
        .module('app', ['ngMap', 'ui.bootstrap'], function($locationProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        });

})();
