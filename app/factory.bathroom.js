(function() {
    'use strict';

    angular
        .module('app')
        .factory('BathroomFactory', BathroomFactory);

    BathroomFactory.$inject = ['$http', '$log', '$q'];

    /* @ngInject */
    function BathroomFactory($http, $log, $q) {
        var service = {
            postBathroom: postBathroom,
            geocodeAddress: geocodeAddress,
            getBathrooms: getBathrooms,
            geoLocate: geoLocate,
            postReview: postReview,
            addAmenityToBathroom: addAmenityToBathroom
        };
        return service;

        function addAmenityToBathroom(bathroomId, amenityId) {

            var address = "https://loocatorapi.azurewebsites.net/api/bathrooms/" + bathroomId + "/addAmenity/" + amenityId;

            var defer = $q.defer();

            $http({
                method: 'POST',
                url: address
            }).then(function(response) {
                defer.resolve(response);
                console.log("amenity");
                console.log(response);
            }, function(error) {
                defer.reject(error);
                $log.error(error);
            });

            return defer.promise;

        }

        function geoLocate() {
            var defer = $q.defer();

            $http({
                method: 'POST',
                url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDJXtSaRqVDtxgWE4Dh0EqvOLEsdYf_qV0'
            }).then(function(response) {
                defer.resolve(response);
            }, function(error) {
                defer.reject(error);
                $log.error(error);
            });

            return defer.promise;
        }


        function getBathrooms(lat, lng) {
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: 'https://loocatorapi.azurewebsites.net/api/bathrooms/location?latitude=' + lat + '&longitude=' + lng
            }).then(function(response) {
                defer.resolve(response);
            }, function(error) {
                defer.reject(error);
                $log.error(error);
            });

            return defer.promise;
        }

        function geocodeAddress(address) {
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyDJXtSaRqVDtxgWE4Dh0EqvOLEsdYf_qV0'
            }).then(function(response) {
                defer.resolve(response.data.results[0].geometry.location);
            }, function(error) {
                defer.reject(error);
                $log.error(error);
            });

            return defer.promise;
        }


        function postBathroom(data) {
            var defer = $q.defer();

            $http({
                method: 'POST',
                url: 'https://loocatorapi.azurewebsites.net/api/bathrooms/',
                data: data

            }).then(function(response) {
                    defer.resolve(response);
                    console.log("bathroom");
                    console.log(response);
                },
                function(error) {
                    defer.reject(error);
                    $log.error(error);
                });

            return defer.promise;
        }

        function postReview(data) {
            var defer = $q.defer();

            $http({
                method: 'POST',
                url: 'https://loocatorapi.azurewebsites.net/api/reviews',
                data: data

            }).then(function(response) {
                    defer.resolve(response);
                },
                function(error) {
                    defer.reject(error);
                    $log.error(error);
                });

            return defer.promise;
        }

    }
})();
