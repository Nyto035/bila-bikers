
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
                $scope.latlng = "";
                $ionicPlatform.ready(function() {
                    NgMap.getMap().then(function(map) {
                        var center = map.getCenter();
                        $scope.map = map;
                        $scope.center = [-1.3165578,36.84991969999999];
                        // $scope.latlng = $scope.center;
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
                    console.log($locale);
                });

                $scope.getpos = function (event) {
                    $scope.lat = event.latLng.lat();
                    $scope.lng = event.latLng.lng();
                    $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
                    console.log([event.latLng.lat(), event.latLng.lng()]);
                };


                $scope.placeMarker = function(){
                    console.log("called", $scope.destination);
                    var loc = this.getPlace().geometry.location;
                    console.log(loc.lat());  
                    $scope.latlng = [loc.lat(), loc.lng()];
                    $scope.center = [loc.lat(), loc.lng()];
                };
            }]);
})(window.angular);


