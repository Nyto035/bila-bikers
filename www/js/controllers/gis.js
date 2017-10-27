
(function (angular) {
    angular.module("app.controllers.gis", [
            'app.services.webSockets',
        ])
        .controller("gisController", ["$scope", "NgMap", "$ionicPlatform",
            "$window", "$locale", '$ionicPopover', 'apiBackend', 'NotificationService',
            'UserService', '$cordovaGeolocation', '$ionicModal', '$state', '$timeout',
            '$myWebSocket', '$rootScope', '$ionicLoading', 'LocationService', '$timeout',
            function ($scope, NgMap, $ionicPlatform, $window, $locale, $ionicPopover,
                callApi, NotificationService, UserService, $cordovaGeolocation, $ionicModal,
                $state, $timeout, myWebSocket, $rootScope, $ionicLoading, LocationService,
                $timeeout) {
                $scope.refresh = function() {
                    $window.location.reload(true);
                };
                // $scope.user = {};
                $scope.map = {};
                $scope.latlng = null;
                $scope.center = {};
                /*End of websockets*/
                $scope.getCurrLocation = function currFxn() {
                    var posOptions = {timeout: 10000, enableHighAccuracy: false};
                    $cordovaGeolocation.getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat  = position.coords.latitude
                        var long = position.coords.longitude
                        var latlong = {lat: parseFloat(lat), lng: parseFloat(long)};
                        $scope.src = {lat: parseFloat(lat), lng: parseFloat(long)};
                        /*if ($scope.center.lat() === 0) {
                            $scope.center = new google.maps.LatLng($scope.src.lat, $scope.src.lng);
                        }*/
                        $scope.latLong = latlong;
                        var geocoder = new google.maps.Geocoder;
                        geocoder.geocode({'location': latlong}, function(results, status) {
                            if (status === 'OK' && results[0]) {
                                $scope.from_name = results[0].formatted_address;
                                console.log($scope.from_name);
                            }
                        });
                    },function(err) {
                        console.log(err);
                    });
                };
                $scope.locationAccuracy = function getLoc() {
                    $ionicLoading.show();
                    LocationService.getLocation()
                    .then(function(position) {
                        $ionicLoading.hide();
                    })
                };
                
                $scope.getpos = function (event) {
                    $scope.lat = event.latLng.lat();
                    $scope.lng = event.latLng.lng();
                    $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
                };


                $scope.placeMarker = function(p){
                    // open modal
                    $scope.destination = undefined;
                    $scope.openModal();
                    // var loc = this.getPlace().geometry.location;
                    var loc = p.geometry.location;
                    $scope.dest = {
                        lat: loc.lat(),
                        lng: loc.lng(),
                    };
                    if (p.address_components[0]) {
                        $scope.dest.name = p.address_components[0].long_name;
                    }
                    /* $scope.src = {
                        lat: $scope.center.lat(),
                        lng: $scope.center.lng(),
                    };*/
                    var markers = [];
                    markers.push($scope.dest);
                    markers.push($scope.src);
                    $scope.way_points = [
                        {
                            location: $scope.src,
                            stopover: true,
                        },
                        {
                            location: $scope.dest,
                            stopover: true,
                        }
                    ];

                    $scope.latlng = [loc.lat(), loc.lng()];
                    $scope.center = new google.maps.LatLng($scope.src.lat, $scope.src.lng);
                    var distance = 
                        google.maps.geometry.spherical.computeDistanceBetween($scope.center, loc);
                    $scope.distance = distance;
                    $scope.path = markers.map(function(marker){
                        return [marker.lat,marker.lng];
                    });
                };

                $scope.acceptingOeder = function acceptFxn() {
                    UserService.getLoggedInUsers().then(function (results) {
                        if (results.rows.length > 0) {
                            $scope.user = results.rows.item(0);
                            $scope.loaded = true;
                            if ($scope.user.user_type === 'COURIER' &&
                                $scope.data.payload.push_action === 'create') {
                                $scope.modal.show();
                                $scope.currOrder = $scope.data.payload;
                                var id = $scope.currOrder.id;
                                $state.go('app.gis', { 'order_id': id }, { 'notify': false });
                            } else if ($scope.user.user_type === 'CUSTOMER' &&
                                $scope.data.payload.push_action === 'update'&&
                                $scope.data.payload.customer === $scope.user.id) {
                                $state.go('app.orders',
                                    {
                                        'order_id': $scope.data.payload.id,
                                        'status': $scope.data.payload.status,
                                    })
                            }
                        }
                    }, function (error) {
                        NotificationService.showError(error);
                    });
                };

                $rootScope.$on('delivery_data', function(evt, data) {
                    $scope.loaded = false;
                    $scope.data = JSON.parse(data.data);
                    console.log('Received event', $scope.data);
                    $scope.acceptingOeder();
                });

                $rootScope.$on('location_data', function(evt, data) {
                    $scope.loc_data = JSON.parse(data.data);
                    $scope.getCouriers();
                });

                $scope.$on('g-places-autocomplete:select', function(event, param) {
                    $scope.placeMarker(param);
                    $scope.getCurrLocation();
                })
                /* Confirming order popover*/
                $scope.createPopover = function popFxn($event) {
                    $ionicPopover.fromTemplateUrl('templates/add_order.html', {
                        scope: $scope,
                        id: 1,
                    })
                    .then(function(popover) {
                        $scope.popover = popover;
                    });
                    $ionicPopover.fromTemplateUrl('templates/accept_order.html', {
                        scope: $scope,
                        id: 2,
                    })
                    .then(function(popover) {
                        $scope.loc_popover = popover;
                    });
                };
                $scope.createPopover();
                $scope.openPopover = function($event, context, account) {
                    $scope.popover.show($event);
                };
                $scope.openLocPopover = function($event) {
                    $scope.loc_popover.show($event);
                };
                $scope.closePopover = function() {
                    $scope.popover.hide();
                };
                $scope.closeLocPopover = function() {
                    $scope.loc_popover.hide();
                };
                $scope.openAcceptPopover = function($event) {
                    $scope.accept_popover.show($event);
                };
                $scope.closeAcceptPopover = function() {
                    $scope.accept_popover.hide();
                };
                // shortest distance
                $scope.calcDistance = function distanceFxn(origin, dest) {
                    var routeResults = [];
                    var directionsService = new google.maps.DirectionsService;
                    console.log(directionsService);
                    var request = {
                        origin: origin,
                        destination: dest,
                        travelMode: 'DRIVING',
                        optimizeWaypoints: true,
                        unitSystem: google.maps.UnitSystem.IMPERIAL
                    };
                    directionsService.route(request,
                    function(response) {
                        console.log(response);
                    });
                    directionsService.route(request,
                        function(response, status) {
                            if (status === 'OK') {
                                console.log(response.routes[0].legs[0].distance.value);
                                return response;
                            } else {
                                return 0;
                            }
                        });
                };
                $scope.getCouriers = function(user) {
                    var tokenObj = {
                        'token': $scope.user.token,
                    };
                    callApi.get(tokenObj, 'location')
                    .then(function(response){
                        $scope.couriers = response.data.results;
                        $scope.loaded_couriers = true;
                        if ($scope.couriers.length > 0) {
                            _.each($scope.couriers, function(c) {
                                c.point = c.current_location.coordinates;
                                var p1 = new google.maps.LatLng(c.point[0], c.point[1]);
                                var p2 = new google.maps.LatLng($scope.src.lat, $scope.src.lng);;
                                var distance = 
                                    google.maps.geometry.spherical.computeDistanceBetween(p2, p1);
                                if (distance > 6000) {
                                    $scope.couriers = _.without($scope.couriers, c);
                                }
                            });
                        }
                    })
                    .catch(function(error){
                        console.log(error);
                        NotificationService.showError(error);
                    });
                    callApi.get(tokenObj, 'orders')
                    .then(function(response){
                        $scope.orders = response.data.results[0];
                    })
                    .catch(function(error){
                        console.log(error);
                        NotificationService.showError(error);
                    });
                };
                /* Modals*/
                $scope.createModal = function() {
                    $ionicModal.fromTemplateUrl('templates/order_feedback.html', {
                        id: 1,
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function(modal) {
                        $scope.modal = modal;
                    });
                };
                $scope.$watch(function($scope) { return $scope.center },
                    function(newVal, oldVal) {
                        if (_.has($scope.user, 'user_type') &&
                            $scope.user.user_type === 'COURIER') {
                            $scope.createLocation();
                        } else if ($scope.user.user_type === 'CUSTOMER') {
                            $scope.mapDetails();
                        }
                    });
                var mytimeout = '';
                // create or update courier location
                $scope.myLocation = function myLocFxn() {
                    if ($scope.currLocation.length === 0) {
                        if (!_.isUndefined($scope.center) &&
                            _.has($scope.center, 'lat')) {
                            var now = new Date();
                            var locArray = {
                                type: 'Point',
                                coordinates: [$scope.center.lat(), $scope.center.lng()]
                            };
                            var obj = {
                                courier: $scope.user.id,
                                current_location: locArray,
                                location_time: now,
                            };
                            callApi.post(obj, 'location', 'location_update')
                            .then(function(){})
                            .catch(function(error){
                                console.log(error);
                                NotificationService.showError(error)
                            })
                        }
                    } else {
                        if (_.has($scope.center, 'lat')) {
                            var now = new Date();
                            var locArray = {
                                type: 'Point',
                                coordinates: [$scope.center.lat(), $scope.center.lng()]
                            };
                            var obj = {
                                courier: $scope.user.id,
                                current_location: locArray,
                                location_time: now,
                            };
                            callApi.patch(obj, 'location', $scope.currLocation[0].id)
                            .then(function(){})
                            .catch(function(error){
                                console.log(error);
                                NotificationService.showError(error)
                            })
                            
                        }
                    }
                };
                // create or update location details for courier
                $scope.createLocation = function locFxn() {
                    var tokenObj = {
                        'token': $scope.user.token,
                    };
                    var params = { 'courier': $scope.user.id };
                    callApi.list(tokenObj, 'location', params)
                    .then(function(response){
                        $scope.currLocation = response.data.results;
                        $scope.myLocation();
                    })
                    .catch(function(error){
                        console.log(error);
                        NotificationService.showError(error);
                    });
                    mytimeout = $timeeout($scope.createLocation, 20000);
                };
                // get user and determine what to show
                $scope.getUser = function usrFxn() {
                    UserService.getLoggedInUsers().then(function (results) {
                        if (results.rows.length > 0) {
                            $scope.user = results.rows.item(0);
                            $scope.loaded = true;
                            if ($scope.user.user_type === 'COURIER') {
                                $scope.createLocation();
                            } else if ($scope.user.user_type === 'CUSTOMER') {
                                $scope.getCouriers($scope.user);
                            }
                        }
                    }, function (error) {
                        NotificationService.showError(error);
                    });
                };
                // map details
                $scope.mapDetails = function mapFxn() {
                    NgMap.getMap().then(function(map) {
                        var center = map.getCenter();
                        $scope.map = map;
                        $scope.center = map.getCenter();
                        google.maps.event.trigger(map, "resize");
                        /* Setting geocoder*/
                        $scope.src_details = map.setCenter(center);
                        $scope.getUser();
                        $scope.getCurrLocation();
                    }).catch(function(error){
                        console.log(error);
                    });
                    $scope.callbackFunc = function(param) {
                        $scope.center = $scope.map.getCenter();
                    };
                };

                // getting orders
                $ionicPlatform.ready(function () {
                    $scope.mapDetails();
                    $scope.createModal();
                    $scope.createPopover();
                    // $scope.getUser();
                    // $scope.acceptingOeder();
                    /* Dummy timeout function*/
                });
                $scope.openModal = function($event) {
                    $scope.modal.show($event);
                    /* $state.go($state.current, { 'order_id': $scope.orders.id },
                        { 'notify': false});*/
                };
                $scope.closeModal = function() {
                    $scope.modal.hide();
                };
                /* Making an order*/
                $scope.addOrder = function(order) {
                    var postObj = {
                        'owner': $scope.user.id,
                        'name': order.name,
                        'description': order.description,
                        'customer': $scope.user.id,
                        'distance': $scope.distance,
                        'source': [$scope.latLong.lat, $scope.latLong.lng],
                        'source_name': $scope.from_name,
                        'destination': [$scope.dest.lat, $scope.dest.lng],
                        'destination_name': $scope.dest.name,
                    };
                    callApi.post(postObj, 'make_order')
                    .then(function(response){
                        var id = response.data.id || response.data.owner;
                        $state.go('app.gis', { 'order_id': id }, { 'notify': false });
                        $scope.findCourier = true;
                    })
                    .catch(function(error){
                        console.log(error);
                        NotificationService.showError(error);
                    });
                };
                // Accepting an order
                $scope.acceptOrder = function accpFxn() {
                    /* var tokenObj = {
                        'token': $scope.user.token,
                    };
                    callApi.customGet(tokenObj, 'accept_delivery_order',
                        $state.params.order_id, 'orders')
                    .then(function(response){
                        $scope.accepted_order = response.data;
                        $state.go('app.orders', { 'order_id': $scope.accepted_order.id })
                    })*/
                    var patchObj = $scope.currOrder;
                    patchObj.status = 'ACCEPTED';
                    callApi.patch(patchObj, 'orders',
                        $state.params.order_id, 'transition_delivery_order')
                    .then(function(response){
                        $scope.accepted_order = response.data;
                        $state.go('app.orders', {
                            'order_id': $scope.accepted_order.id,
                            'status': $scope.accepted_order.status,
                        });
                    })
                    .catch(function(error){
                        console.log(error);
                        NotificationService.showError(error);
                    });
                };
                //Cleanup the popover when we're done with it!
                $scope.$on('$destroy', function() {
                    $scope.popover.remove();
                    $scope.modal.remove();
                    $scope.loc_popover.remove();
                });
            }]);
})(window.angular);


