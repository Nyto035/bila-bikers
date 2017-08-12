angular.module("app.controllers", [
    "hha.controllers",
    "kia.controllers",
    "hsna.controllers",
    "app.controllers.auth"
])

        .constant("SYNC_EVENTS", {
            on_sync_response: "on-sync-response"
        })

        .controller("AppCtrl", ["$rootScope", "$scope", "ContentSync", "SurveySync", "UserService", "NotificationService", "AUTH_EVENTS", "SYNC_EVENTS",
            function ($rootScope, $scope, ContentSync, SurveySync, UserService, NotificationService, AUTH_EVENTS, SYNC_EVENTS) {

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

                $scope.logout = function () {
                    UserService.logoutUser().then(function () {
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }, function (error) {
                        NotificationService.showError(error);
                    });
                };
            }]);
