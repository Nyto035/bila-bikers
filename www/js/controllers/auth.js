
(function (angular) {
    angular.module("app.controllers.auth", ['ngCordova',])
            .controller("AuthController", ["$rootScope", "$ionicPlatform", "$ionicLoading",
                "$scope", "UserService", "AUTH_EVENTS", "NotificationService", "AuthService",
                "app.services.userInputs.forms", "$state", "$cordovaToast", 'apiBackend',
                function ($rootScope, $ionicPlatform, $ionicLoading, $scope, UserService,
                    AUTH_EVENTS, NotificationService, AuthService, userForm, $state,
                    $cordovaToast, callApi) {
                    $scope.user = {};
                    $scope.user_types = [
                        { 'key': 'Customer', 'value': 'CUSTOMER' },
                        { 'key': 'Courier', 'value': 'COURIER' },
                    ];
                    $scope.customers = [
                        { 'name': 'Customer', 'id': 'CUSTOMER' },
                        { 'name': 'Courier', 'id': 'COURIER' },
                    ];
                    $ionicPlatform.ready(function () {
                        UserService.getLoggedInUsers().then(function (results) {
                            if (results.rows.length > 0) {
                                var user = results.rows.item(0);
                                AuthService.setUser(user);
                                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                            }
                        }, function (error) {
                            NotificationService.showError(error);
                        });
                    });
                    /*toast function*/
                    $scope.showToast = function(message, duration, location) {
                        $ionicPlatform.ready(function () {
                            $cordovaToast.show(message, duration, location).then(function(success) {
                                console.log("The toast was shown");
                            }, function (error) {
                                console.log("The toast was not shown due to " + error);
                            });
                        });
                    };
                    /*end of toast*/
                    $scope.cancelRegistration = function() {
                        /* var msg = 'You cancelled registration';
                        $scope.showToast(msg, 'short', 'bottom');*/
                        $state.go('login');
                    };
                    $scope.register = {};
                    $scope.createFields = userForm.createUser();
                    /* $scope.registerUser = function() {
                        UserService.registerUser($scope.register)
                        .then(function(response){
                            console.log(response);
                            $state.go('login');
                        })
                        .catch(function(error){
                            console.log(error);
                            NotificationService.showError(error);
                        });
                    };*/
                    $scope.registerUser = function() {
                        callApi.post($scope.register, 'user')
                        .then(function(response){
                            console.log(response);
                            $state.go('login');
                        })
                        .catch(function(error){
                            console.log(error);
                            NotificationService.showError(error);
                        });
                    };
                    $scope.login = function () {
                        if (!$scope.user.email) {
                            NotificationService.showError('Email / Username is required');
                            return;
                        }
                        if (!$scope.user.password) {
                            NotificationService.showError('Password is required');
                            return;
                        }
                        callApi.post($scope.user, 'login')
                        .then(function(response){
                            console.log(response);
                            var tokenObj = response.data;
                            callApi.get(tokenObj, 'me')
                            .then(function(response){
                                _.extendOwn(response.data, { 'token': tokenObj.token });
                                // Return when fixed
                                console.log(response.data);
                                var user = response.data;
                                UserService.registerUser(response.data)
                                .then(function(response){
                                    UserService.loginUser(user)
                                    .then(function(response){
                                        $state.go('app.gis');
                                    })
                                    .catch(function(error){
                                        console.log(error);
                                        NotificationService.showError(error);
                                    });
                                })
                                .catch(function(error){
                                    console.log(error);
                                    NotificationService.showError(error);
                                });
                            })
                            .catch(function(error){
                                console.log(error);
                                NotificationService.showError(error);
                            });
                        })
                        .catch(function(error){
                            console.log(error);
                            NotificationService.showError(error);
                        });
                    };
                }]);
})(window.angular);


