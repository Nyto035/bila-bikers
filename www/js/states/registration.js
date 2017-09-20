angular.module('app.states.hha', [])

        .config(function ($stateProvider) {
            $stateProvider
                    .state("app", {
                        url: "/",
                        views: {
                            "content": {
                                templateUrl: 'templates/home.html',
                                controller: "AppCtrl"
                            }
                        }
                    })
                    .state("login", {
                        url: "/login?reg_id",
                        views: {
                            "content": {
                                templateUrl: "templates/login.html",
                                controller: "AuthController"
                            }
                        }
                    })

                    .state("registration", {
                        url: "/registration",
                        views: {
                            "content": {
                                templateUrl: "templates/registration.html",
                                controller: "AuthController"
                            }
                        }
                    })
                    .state("app.gis", {
                        url: "gis?order_id",
                        views: {
                            "survey-content": {
                                templateUrl: "templates/gis.html",
                                controller: "gisController"
                            }
                        }
                    })
                    .state("app.orders", {
                        url: "orders?order_id",
                        views: {
                            "survey-content": {
                                templateUrl: "templates/order_detail.html",
                                controller: "ordersController"
                            }
                        }
                    });
        });
