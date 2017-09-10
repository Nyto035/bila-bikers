
(function (angular) {
    angular.module("app.controllers.gis", [])
        .controller("gisController", ["$scope", "NgMap", "$ionicPlatform",
            "$window", "$locale", '$ionicPopover',
            function ($scope, NgMap, $ionicPlatform, $window, $locale, $ionicPopover) {
                $scope.refresh = function() {
                    $window.location.reload(true);
                };
                $scope.user = {};
                $scope.map = {};
                $scope.latlng = null;
                $scope.center = [];
                $ionicPlatform.ready(function() {
                    NgMap.getMap().then(function(map) {
                        var center = map.getCenter();
                        $scope.map = map;
                        // $scope.center = [-1.3165578,36.84991969999999];
                        // $scope.latlng = $scope.center;
                        $scope.center = map.getCenter();
                        google.maps.event.trigger(map, "resize");
                        map.setCenter(center);
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
                    console.log("called", p.geometry.location);
                    // var loc = this.getPlace().geometry.location;
                    var loc = p.geometry.location;
                    $scope.dest = {
                        lat: loc.lat(),
                        lng: loc.lng(),
                    };
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
                    console.log(event);
                    console.log(param);
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
            }]);
})(window.angular);


