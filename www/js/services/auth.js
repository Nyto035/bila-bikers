/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (angular) {
    angular.module("app.services.auth", [])

            .constant("AUTH_EVENTS", {
                loginSuccess: "auth-login-success",
                loginFailed: "auth-login-failed",
                logoutSuccess: "auth-logout-success",
                sessionTimeout: "auth-session-timeout",
                notAuthenticated: "auth-not-authenticated",
                notAuthorized: "auth-not-authorized"
            })

            

            .service("AuthInterceptor", ["$injector", "$location", "$rootScope", "$q", "AUTH_EVENTS", function (
                        $injector, $location, $rootScope, $q, AUTH_EVENTS) {
                    var AuthInterceptor = {
                        request: function (config) {
                            var Auth = $injector.get("AuthService");
                            var token = Auth.getToken();

                            if (token) {
                                var header_name = "Authorization";
                                config.headers[header_name] = "JWT " + token;
                            }

                            return config;
                        },
                        response: function (response) {
                            return response;
                        },
                        responseError: function (response) {
                            if (response.status === 403) {
                                var login = "/login";
                                var next = $location.path();
                                $location.path(login).search("next", next);
                                return $q.reject(response);
                            } else if (response.status === 500) {
                                return $q.reject(response);
                            } else if (response.status === 401) {
                                if (response.data.detail === "Signature has expired.") {
                                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                                    return $q.reject(response);
                                } else {
                                    return $q.reject(response);
                                }
                            } else {
                                return $q.reject(response);
                            }
                        }
                    };

                    return AuthInterceptor;
                }
            ])

            .service("AuthService", ["$rootScope", "$http", "$state", "AUTH_EVENTS", "SERVER_URL", "UserService",
                function ($rootScope, $http, $state, AUTH_EVENTS, SERVER_URL, UserService) {
                    var user = null;
                    var token = null;

                    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
                        user = null;
                        $state.go("login");
                    });

                    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
                        user = null;
                        $state.go("login");
                    });

                    $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
                        $state.go("app.hha");
                    });

                    this.getToken = function () {
                        return token;
                    };

                    this.setToken = function (tkn) {
                        token = tkn;
                    };

                    this.getUser = function () {
                        return user;
                    };

                    this.setUser = function (newUser) {
                        user = newUser;
                        user.token = user.Token || user.token;
                        user.email = user.LoweredEmail || user.email;
                        user.county = user.county || user.County;
                        this.setToken(user.token);

                    };

                    this.isAuthenticated = function () {
                        return (user !== null);
                    };

                    this.login = function (credentials) {
                        return $http.post(SERVER_URL + "token-auth/", credentials);
                    };

                    this.getCurrentUser = function () {
                        return $http.get(SERVER_URL + "auth/me/");
                    };


                }]);
})(window.angular);


