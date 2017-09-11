
(function (angular) {
    angular.module("app.controllers.gis", [])
        .controller("gisController", ["$scope", "NgMap", "$ionicPlatform",
            "$window", "$locale", '$ionicPopover', 'apiBackend', 'NotificationService',
            'UserService', '$cordovaGeolocation', '$ionicModal', '$state',
            function ($scope, NgMap, $ionicPlatform, $window, $locale, $ionicPopover,
                callApi, NotificationService, UserService, $cordovaGeolocation, $ionicModal,
                $state) {
                $scope.refresh = function() {
                    $window.location.reload(true);
                };
                // $scope.user = {};
                $scope.map = {};
                $scope.latlng = null;
                $scope.center = [];
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


                $scope.placeMarker = function(p){
                    // var loc = this.getPlace().geometry.location;
                    var loc = p.geometry.location;
                    $scope.dest = {
                        lat: loc.lat(),
                        lng: loc.lng(),
                    };
                    if (p.address_components[0]) {
                        $scope.dest.name = p.address_components[0].long_name;
                    }
                    $scope.src = {
                        lat: $scope.center.lat(),
                        lng: $scope.center.lng(),
                    };
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
                    // $scope.center = [loc.lat(), loc.lng()];
                    $scope.path = markers.map(function(marker){
                        return [marker.lat,marker.lng];
                    });
                };

                $scope.$on('g-places-autocomplete:select', function(event, param) {
                    $scope.placeMarker(param);
                })
                /* Confirming order popover*/
                 $scope.createPopover = function popFxn($event) {
                    $ionicPopover.fromTemplateUrl('templates/add_order.html', {scope: $scope})
                    .then(function(popover) {
                        $scope.popover = popover;
                    });
                };
                $scope.createPopover();
                $scope.openPopover = function($event, context, account) {
                    $scope.popover.show($event);
                };
                $scope.closePopover = function() {
                    $scope.popover.hide();
                };
                $scope.getCouriers = function(user) {
                    var tokenObj = {
                        'token': user.token,
                    };
                    callApi.get(tokenObj, 'location')
                    .then(function(response){
                        $scope.couriers = response.data;
                    })
                    .catch(function(error){
                        console.log(error);
                        NotificationService.showError(error);
                    });
                };
                $ionicPlatform.ready(function () {
                    UserService.getLoggedInUsers().then(function (results) {
                        if (results.rows.length > 0) {
                            $scope.user = results.rows.item(0);
                            $scope.getCouriers($scope.user);
                        }
                    }, function (error) {
                        NotificationService.showError(error);
                    });
                });
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
                $scope.createModal();
                $scope.openModal = function($event) {
                    $scope.modal.show($event);
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
                        'source': [$scope.latLong.lat, $scope.latLong.lng],
                        'source_name': $scope.from_name,
                        'destination': [$scope.dest.lat, $scope.dest.lng],
                        'destination_name': $scope.dest.name,
                    };
                    console.log(postObj);
                    callApi.post(postObj, 'make_order')
                    .then(function(response){
                        console.log(response);
                        var id = response.data.id || response.data.owner;
                        $state.go('app.gis', { 'order_id': id }, { 'notify': false });
                        $scope.openModal();
                    })
                    .catch(function(error){
                        console.log(error);
                        NotificationService.showError(error);
                    });
                };
            }]);
})(window.angular);


