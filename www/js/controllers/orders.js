
(function (angular) {
    angular.module("app.controllers.orders", [
            'app.services.webSockets',
        ])
        .controller("ordersController", ["$scope", "NgMap", "$ionicPlatform",
            "$window", "$locale", '$ionicPopover', 'apiBackend', 'NotificationService',
            'UserService', '$cordovaGeolocation', '$ionicModal', '$state', '$timeout',
            '$myWebSocket', '$rootScope',
            function ($scope, NgMap, $ionicPlatform, $window, $locale, $ionicPopover,
                callApi, NotificationService, UserService, $cordovaGeolocation, $ionicModal,
                $state, $timeout, myWebSocket, $rootScope) {
                $scope.map = {};
                $scope.latlng = null;
                $scope.center = [];
                /*End of websockets*/
                $scope.getCurrLocation = function currFxn() {
                    var posOptions = {timeout: 10000, enableHighAccuracy: false};
                    $cordovaGeolocation.getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat  = position.coords.latitude
                        var long = position.coords.longitude
                        var latlong = {lat: parseFloat(lat), lng: parseFloat(long)};
                        $scope.latLong = latlong;
                        var geocoder = new google.maps.Geocoder;
                        geocoder.geocode({'location': latlong}, function(results, status) {
                            if (status === 'OK' && results[0]) {
                                $scope.from_name = results[0].formatted_address;
                            }
                        });
                    },function(err) {
                        console.log(err);
                    });
                };
                $ionicPlatform.ready(function() {
                    NgMap.getMap().then(function(map) {
                        var center = map.getCenter();
                        $scope.map = map;
                        // $scope.center = [-1.3165578,36.84991969999999];
                        // $scope.latlng = $scope.center;
                        $scope.center = map.getCenter();
                        google.maps.event.trigger(map, "resize");
                        /* Setting geocoder*/
                        $scope.src_details = map.setCenter(center);
                        $scope.getCurrLocation();
                        /*console.log('markers', map.markers);
                        console.log('shapes', map.shapes);*/
                    }).catch(function(error){
                        console.log(error);
                    });
                    $scope.callbackFunc = function(param) {
                        $scope.center = $scope.map.getCenter();
                    };
                });

                $scope.getpos = function (event) {
                    $scope.lat = event.latLng.lat();
                    $scope.lng = event.latLng.lng();
                    $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
                    console.log([event.latLng.lat(), event.latLng.lng()]);
                };


                $scope.placeMarker = function(o){
                    // var loc = this.getPlace().geometry.location;
                    var dest = _.has(o, 'destination') ? o.destination.coordinates : '';
                    var source = _.has(o, 'source') ? o.source.coordinates : '';
                    $scope.dest = {
                        lat: dest[0],
                        lng: dest[1],
                    };
                    $scope.pickup = {
                        lat: source[0],
                        lng: source[1],
                    };
                    $scope.src = {
                        lat: $scope.center.lat(),
                        lng: $scope.center.lng(),
                    };
                    $scope.picklng = _.has(o, 'source') ? o.source.coordinates : '';
                    $scope.latlng = _.has(o, 'destination') ? o.destination.coordinates : '';
                    var markers = [];
                    markers.push($scope.dest);
                    markers.push($scope.src);
                    $scope.way_points = [
                        {
                            location: $scope.pickup,
                            stopover: false,
                        },
                    ];
                    $scope.path = markers.map(function(marker){
                        return [marker.lat,marker.lng];
                    });
                };
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
                        $scope.accept_popover = popover;
                    });
                };
                $scope.createPopover();
                $scope.openPopover = function($event, context, account) {
                    $scope.popover.show($event);
                };
                $scope.closePopover = function() {
                    $scope.popover.hide();
                };
                $scope.openAcceptPopover = function($event) {
                    $scope.accept_popover.show($event);
                };
                $scope.closeAcceptPopover = function() {
                    $scope.accept_popover.hide();
                };
                $scope.getSelectedOrder = function() {
                    var tokenObj = {
                        'token': $scope.user.token,
                    };
                    callApi.get(tokenObj, 'orders', $state.params.order_id)
                    .then(function(response){
                        $scope.order = response.data;
                        $scope.placeMarker($scope.order);
                    })
                    .catch(function(error){
                        console.log(error);
                        NotificationService.showError(error);
                    });
                };
                /* Modals*/
                $scope.createModal = function() {
                    $ionicModal.fromTemplateUrl('templates/complete_delivery.html', {
                        id: 1,
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function(modal) {
                        $scope.modal = modal;
                    });
                };
                // get user
                $scope.loggedInUser = function() {
                    UserService.getLoggedInUsers().then(function (results) {
                        if (results.rows.length > 0) {
                            $scope.user = results.rows.item(0);
                            $scope.loaded = true;
                            $scope.getSelectedOrder();
                            if ($scope.user.user_type === 'COURIER') {
                                $scope.modal.show();
                                $scope.currOrder = $scope.data.payload;
                            }
                        }
                    }, function (error) {
                        NotificationService.showError(error);
                    });
                };
                // getting orders
                $ionicPlatform.ready(function () {
                    $scope.createModal();
                    $scope.createPopover();
                    $scope.loggedInUser();
                    /* Dummy timeout function*/
                });
                $scope.openModal = function($event) {
                    $scope.placeMarker($scope.order);
                    $scope.modal.show($event);
                };
                $scope.closeModal = function() {
                    $scope.modal.hide();
                };
                // Accepting an order
                $scope.pickOrder = function accpFxn() {
                    var tokenObj = {
                        'token': $scope.user.token,
                    };
                    callApi.customGet(tokenObj, 'accept_delivery_order',
                        $state.params.order_id, 'orders')
                    .then(function(response){
                        $scope.accepted_order = response.data;
                        $state.go('app.orders', { 'order_id': $scope.accepted_order.id });
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
                    $scope.accept_popover.remove();
                });
            }]);
})(window.angular);


