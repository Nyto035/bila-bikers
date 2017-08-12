
(function (angular) {
    angular.module("app.controllers.gis", [])
        .controller("gisController", ["$scope", "NgMap", "$ionicPlatform",
            function ($scope, NgMap, $ionicPlatform) {
                $scope.user = {};
                $scope.map = "";
                $ionicPlatform.ready(function() {
                    NgMap.getMap().then(function(map) {
                        var center = map.getCenter();
                        $scope.map = map;
                        google.maps.event.trigger(map, "resize");
                        map.setCenter(center);
                        console.log('markers', map.markers);
                        console.log('shapes', map.shapes);
                    }).catch(function(error){
                        console.log(error);
                    });
                    $scope.callbackFunc = function(param) {
                        console.log('You are at' + $scope.map.getCenter());
                    };
                });
            }]);
})(window.angular);


