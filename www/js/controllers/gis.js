
(function (angular) {
    angular.module("app.controllers.gis", [])
        .controller("gisController", ["$scope", "NgMap", "$ionicPlatform",
            "$window", "$locale",
            function ($scope, NgMap, $ionicPlatform, $window, $locale) {
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
                        $scope.center = map.getCenter();
                        google.maps.event.trigger(map, "resize");
                        map.setCenter(center);
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
                        },
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
            }]);
})(window.angular);


