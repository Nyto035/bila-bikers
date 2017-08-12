angular.module("app.controllers", [
    "hha.controllers",
    "kia.controllers",
    "hsna.controllers",
    "app.controllers.gis",
    "app.controllers.auth"
])

        .constant("SYNC_EVENTS", {
            on_sync_response: "on-sync-response"
        })

        .controller("AppCtrl", ["$rootScope", "$scope", "ContentSync", "SurveySync", "UserService", "NotificationService", 
            "AUTH_EVENTS", "SYNC_EVENTS", "$state", "$ionicPlatform",
            function ($rootScope, $scope, ContentSync, SurveySync, UserService, NotificationService, AUTH_EVENTS,
                SYNC_EVENTS, $state, $ionicPlatform) {

                $scope.update = function () {
                    ContentSync.synchronize();
                };

                $scope.syncButtonText = "Synchronize";
                $scope.showSyncButton = function (show) {
                    $scope.syncButtonEnabled = show;
                };

                $scope.synchronize = function () {
                    SurveySync.synchronize(function (syncButtonText) {
                        $scope.syncButtonText = syncButtonText;
                        $rootScope.$broadcast(SYNC_EVENTS.on_sync_response);
                    });
                };
                $scope.currentUser = function() {
                    $ionicPlatform.ready(function() {
                        UserService.getLoggedInUsers()
                        .then(function(results){
                            if(results.rows.length > 0){
                                $scope.user = results.rows.item(0);
                            }
                        })
                        .catch(function(error){
                            NotificationService.showError(error);
                        })
                    })
                };
                $scope.currentUser();
                $scope.logout = function () {
                    UserService.logoutUser().then(function () {
                        $state.go('login');
                        //$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }, function (error) {
                        NotificationService.showError(error);
                    });
                };
            }]);
