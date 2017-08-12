
(function (angular) {
    angular.module("app.controllers.auth", [])
            .controller("AuthController", ["$rootScope", "$ionicPlatform", "$ionicLoading",
                "$scope", "UserService", "AUTH_EVENTS", "NotificationService", "AuthService",
                "app.services.userInputs.forms", "$state",
                function ($rootScope, $ionicPlatform, $ionicLoading, $scope, UserService,
                    AUTH_EVENTS, NotificationService, AuthService, userForm, $state) {
                    $scope.user = {};
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
                    $scope.register = {};
                    $scope.createFields = userForm.createUser();
                    $scope.registerUser = function() {
                        UserService.registerUser($scope.register)
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
                        UserService.getByEmail($scope.user.email)
                        .then(function(results){
                            if(results.rows.length > 0){
                                var user = results.rows.item(0);
                                console.log(user);
                                UserService.loginUser(user)
                                .then(function(){
                                    $state.go('app.gis');
                                })
                                .catch(function(error){
                                    NotificationService.showError(error);
                                });
                            } else {
                                $scope.errorMessage = "Invalid username or password";
                            }
                        })
                        .catch(function(error){
                            console.log(error);
                            NotificationService.showError(error);
                        });
                        /*$ionicLoading.show();
                        AuthService.login($scope.user)
                        .then(function (response) {
                            if (response.status === 200) {
                                // set token and fetch details of current user
                                AuthService.setToken(response.data.token);
                                AuthService.getCurrentUser().
                                        then(function (response) {
                                            if (response.status === 200) {

                                                $ionicLoading.hide();

                                                var EWSUser = response.data;
                                                EWSUser.Password = $scope.user.password;
                                                EWSUser.Token = AuthService.getToken();

                                                UserService.getByEmail(EWSUser.LoweredEmail).then(function (results) {
                                                    if (results.rows.length > 0) {
                                                        UserService.updateUser(EWSUser).then(function () {

                                                        }, function (error) {
                                                            NotificationService.showError(error);
                                                        });
                                                    } else {
                                                        UserService.createUser(EWSUser).then(function () {

                                                        }, function (error) {
                                                            NotificationService.showError(error);
                                                        });
                                                    }
                                                }, function (error) {
                                                    NotificationService.showError(error);
                                                });



                                                AuthService.setUser(response.data);
                                                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                                            } else {
                                                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                                            }
                                        }, function (error) {
                                            NotificationService.showError(error);
                                            $ionicLoading.hide();
                                        });
                            } else if (response.status === 400) {
                                $ionicLoading.hide();
                                NotificationService.showError('Invalid email or password or both!');
                            } else {
                                $ionicLoading.hide();
                                NotificationService.showError(response.statusText);
                            }
                        }, function (response) {
                            $ionicLoading.hide();
                            if (response.status === 500) {
                                NotificationService.showError("Authenication Error!", "Please crosscheck your email");
                            } else if (response.status === 400 && response.data.non_field_errors[0] === "Unable to login with provided credentials.") {
                                NotificationService.showError("Authenication Error!", "Please crosscheck your password");
                            } else {
                                NotificationService.showError("Authenication Error!", "Authentication failed");
                            }
                        });*/
                    };
                }]);
})(window.angular);


