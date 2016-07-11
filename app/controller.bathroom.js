(function() {
    'use strict';

    angular
        .module('app')
        .controller('BathroomController', BathroomController);

    BathroomController.$inject = ['$timeout', 'BathroomFactory', '$rootScope', 'NgMap', '$window'];

    /* @ngInject */
    function BathroomController($timeout, BathroomFactory, $rootScope, NgMap, $window) {
        var vm = this;
        var currentMarker = { setAnimation: function(p) {} };
        var data = {};
        var amenities = {};
        var elementHolder = {};
        var address = '';
        vm.title = 'BathroomController';
        vm.fade = false;
        vm.button = true;
        vm.bathrooms = [];
        vm.markers = [];
        vm.loc = [1, 1];
        vm.results = true;
        vm.singleResult = false;
        vm.currentBathroom = {};
        vm.infoWindow = {};
        vm.myLat = '';
        vm.myLng = '';
        vm.reviewText = '';
        vm.rating = 0;
        vm.bathroomToAdd = {};
        vm.droppedPin = true;
        vm.noResults = false;
        vm.starCheck = false;
        vm.amenities = {};
        vm.check = 'test';

        initialize();

        if ($window.location.href == "http://loocator.herokuapp.com" || "loocator.herokuapp.com") {
            $window.location.href = "https://loocator.herokuapp.com";
        }

        vm.test = function() {


            $rootScope.map.showInfoWindow('bar', this);
            vm.infoWindow = findByLat(this.data);


        };

        vm.addB = function() {

            address = vm.bathroomToAdd.address + ' ' + vm.bathroomToAdd.city + ' ' + vm.bathroomToAdd.state;

            BathroomFactory.geocodeAddress(address).then(function(response) {

                data = {};
                data.BathroomName = vm.bathroomToAdd.name;
                data.Address = vm.bathroomToAdd.address;
                data.City = vm.bathroomToAdd.city;
                data.State = vm.bathroomToAdd.state;
                data.Directions = vm.bathroomToAdd.directions;
                data.Latitude = response.lat;
                data.Longitude = response.lng;
                data.Country = vm.bathroomToAdd.country;

                if (isButtonChecked('#accessible')) {
                    data.Accessible = true;
                } else {
                    data.Accessible = false;
                }

                if (isButtonChecked('#unisex')) {
                    data.Unisex = true;
                } else {
                    data.Unisex = false;
                }

                if (isButtonChecked('#handDryer')) {
                    data.HandDryer = true;
                } else {
                    data.HandDryer = false;
                }

                if (isButtonChecked('#tamponDispenser')) {
                    data.TamponDispenser = true;
                } else {
                    data.TamponDispenser = false;
                }

                if (isButtonChecked('#babyChangingTable')) {
                    data.BabyChangingStation = true;
                } else {
                    data.BabyChangingStation = false;
                }

                if (isButtonChecked('#familyBathroom')) {
                    data.FamilyBathroom = true;
                } else {
                    data.FamilyBathroom = false;
                }

                if (isButtonChecked('#capacityOne')) {
                    data.CapacityOne = true;
                } else {
                    data.CapacityOne = false;
                }

                if (isButtonChecked('#capacityMany')) {
                    data.CapacityMany = true;
                } else {
                    data.CapacityMany = false;
                }

                BathroomFactory.postBathroom(data).then(function(response) {

                    getBathrooms(data.Latitude, data.Longitude);

                    vm.results = false;
                    vm.singleResult = true;

                });


            });
        };


        vm.addReview = function() {
            address = vm.bathroomToAdd.address + ' ' + vm.bathroomToAdd.city + ' ' + vm.bathroomToAdd.state;

            BathroomFactory.geocodeAddress(address).then(function(response) {

                data = {};

                data.BathroomName = vm.bathroomToAdd.name;
                data.Address = vm.bathroomToAdd.address;
                data.City = vm.bathroomToAdd.city;
                data.State = vm.bathroomToAdd.state;
                data.Directions = vm.bathroomToAdd.directions;
                data.Latitude = response.lat;
                data.Longitude = response.lng;
                data.Country = vm.bathroomToAdd.country;

                if (isButtonChecked('#accessible')) {
                    data.Accessible = true;
                } else {
                    data.Accessible = false;
                }

                if (isButtonChecked('#unisex')) {
                    data.Unisex = true;
                } else {
                    data.Unisex = false;
                }

                BathroomFactory.postBathroom(data).then(function(response) {
                    getBathrooms(data.Latitude, data.Longitude);

                    vm.results = false;
                    vm.singleResult = true;

                    amenities = {};

                    if (isButtonChecked('#handDryer')) {
                        BathroomFactory.addAmenityToBathroom(response.data.BathroomId, 17);
                    }

                    if (isButtonChecked('#tamponDispenser')) {
                        BathroomFactory.addAmenityToBathroom(response.data.BathroomId, 18);
                    }

                    if (isButtonChecked('#babyChangingTable')) {
                        BathroomFactory.addAmenityToBathroom(response.data.BathroomId, 19);
                    }

                    if (isButtonChecked('#familyBathroom')) {
                        BathroomFactory.addAmenityToBathroom(response.data.BathroomId, 20);
                    }

                    if (isButtonChecked('#capacityOne')) {
                        BathroomFactory.addAmenityToBathroom(response.data.BathroomId, 21);
                    }

                    if (isButtonChecked('#capacityMany')) {
                        BathroomFactory.addAmenityToBathroom(response.data.BathroomId, 22);
                    }

                });

            });
        };

        vm.selectResult = function(bathroom) {
            if (bathroom.Directions === undefined) {
                vm.droppedPin = false;
            } else {
                vm.droppedPin = true;
            }

            currentMarker.setAnimation(null);
            bathroom.marker.setAnimation(google.maps.Animation.BOUNCE);
            currentMarker = bathroom.marker;
            vm.currentBathroom = bathroom;
            vm.results = false;
            vm.singleResult = true;

        };

        vm.backToResults = function() {
            vm.singleResult = false;
            vm.results = true;
            currentMarker.setAnimation(null);
        };

        vm.toggleBounce = function(bathroom) {
            if (vm.button === false) {
                vm.button = !vm.button;
            }



            vm.currentBathroom = findByLat(bathroom.latLng.lat());


            if (vm.currentBathroom.Directions === undefined) {
                vm.droppedPin = false;
            } else {
                vm.droppedPin = true;
            }

            currentMarker.setAnimation(null);
            vm.results = false;
            vm.singleResult = true;
            currentMarker = this;


            $timeout(function() {
                vm.fade = false;
            }, 300);


            if (this.getAnimation() !== null) {
                this.setAnimation(null);
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
            }

            vm.currentBathroom = findByLat(bathroom.latLng.lat());

        };

        vm.postReview = function() {

            data.BathroomId = vm.currentBathroom.BathroomId;
            data.reviewText = vm.reviewText;
            data.rating = vm.rating;


            BathroomFactory.postReview(data).then(function(response) {
                getBathrooms(vm.currentBathroom.Latitude, vm.currentBathroom.Longitude);
            });

            var stars = $('.rating > input');
            for (var z = 0; z < stars.length; z++) {
                stars[z].checked = false;
            }

            data = {};
            vm.reviewText = '';
            vm.results = false;
            vm.singleResult = true;


        };


        vm.star = function(rate) {
            vm.rating = rate;
        };


        vm.search = function(address) {
            //clear previous bathroom and marker arrays
            vm.markers = [];
            vm.bathrooms = [];

            //set the interface to be looking at all the results in a search
            vm.results = true;
            vm.singleResult = false;

            //Geocode the Address
            BathroomFactory.geocodeAddress(address).then(function(response) {
                //pass lat and long in to database to find nearby bathrooms
                vm.myLat = response.lat;
                vm.myLng = response.lng;

                getBathrooms(response.lat, response.lng);

            });

        };

        //make the buttons and sidebar expand and retract
        vm.buttonClick = function() {

            vm.fade = !vm.fade;
            $timeout(function() {
                vm.button = !vm.button;
            }, 300);
        };

        //Initialize search for current location
        function initialize() {
            NgMap.getMap({ id: 'map' }).then(function(map) {
                $rootScope.map = map;
                vm.map = map;
            });

            //check to see if html5 geolocation is applicable
            if (navigator.geolocation) {
                var startPos;
                navigator.geolocation.getCurrentPosition(function(position) {
                    startPos = position;
                    vm.myLat = startPos.coords.latitude;
                    vm.myLng = startPos.coords.longitude;


                    getBathrooms(vm.myLat, vm.myLng);
                });

            }
            //if it is not, use the google geolocation api
            else {
                BathroomFactory.geoLocate().then(function(response) {

                    vm.myLat = response.data.location.lat;
                    vm.myLng = response.data.location.lng;


                    getBathrooms(vm.myLat, vm.myLng);
                });
            }

        }


        //this function takes in an ID form a checkbox to see if it is checked
        function isButtonChecked(id) {

            elementHolder = $(id);
            if (elementHolder[0].children[0].classList[2] != 'glyphicon-unchecked') {
                return true;
            } else {
                return false;
            }

        }

        //look through the bathroom array to find one by the longitude
        function findByLat(lat) {
            for (var i = 0; i < vm.bathrooms.length; i++) {
                if (vm.bathrooms[i].Latitude == lat) {
                    return vm.bathrooms[i];
                }
            }
        }


        function getBathrooms(lat, lng) {

            BathroomFactory.getBathrooms(lat, lng).then(function(response) {
                vm.bathrooms = response.data;

                //format date on reviews
                for (var i = 0; i < vm.bathrooms.length; i++) {
                    for (var j = 0; j < vm.bathrooms[i].Reviews.length; j++) {
                        vm.bathrooms[i].Reviews[j].CreatedDate = moment(vm.bathrooms[i].Reviews[j].CreatedDate).format("MMMM Do YYYY");

                    }

                }


                $timeout(function() {

                    NgMap.getMap({ id: 'map' }).then(function(map) {

                        //set up conditions if the search doesn't return any results
                        if (vm.bathrooms.length === 0) {
                            map.setCenter(new google.maps.LatLng(vm.myLat, vm.myLng));
                            map.setZoom(15);
                            vm.noResults = true;

                        } else {

                            vm.noResults = false;
                        }

                        //add marker refrences to the bathrooms retrieved
                        for (var k = 1; k < vm.bathrooms.length + 1; k++) {
                            vm.bathrooms[k - 1].marker = map.markers[k];
                        }

                    });

                }, 300);

                //if a bathroom has just been added, it will be set as the current bathroom
                vm.currentBathroom = findByLat(lat);


            });

        }


    }
})();
