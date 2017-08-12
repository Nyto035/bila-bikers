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
                        url: "gis",
                        views: {
                            "survey-content": {
                                templateUrl: "templates/gis.html",
                                controller: "gisController"
                            }
                        }
                    })

                    .state("app.hha", {
                        url: "hha/?id",
                        views: {
                            'survey-content': {
                                templateUrl: "templates/hha/list.html",
                                controller: "HHAListController"
                            }
                        }
                    })


                    .state("app.hha.new_hha", {
                        url: "new_hha",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hha/hha_background.html",
                                controller: "NewHHASurveyController"
                            }
                        }
                    })

                    .state("app.hha.hha_livestock", {
                        url: "hha_livestock",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hha/hha_livestock.html",
                                controller: "NewHHASurveyController"
                            }
                        }
                    })

                    .state("app.hha.hha_crop_production", {
                        url: "hha_crop_production",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hha/hha_crop_production.html",
                                controller: "NewHHASurveyController"
                            }
                        }
                    })

                    .state("app.hha.hha_stocks", {
                        url: "hha_stocks",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hha/hha_food_stocks.html",
                                controller: "NewHHASurveyController"
                            }
                        }
                    })

                    .state("app.hha.hha_income_sources", {
                        url: "hha_income_sources",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hha/hha_income_sources.html",
                                controller: "NewHHASurveyController"
                            }
                        }
                    })

                    .state("app.hha.hha_water_resources", {
                        url: "hha_water_resources",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hha/hha_water_resources.html",
                                controller: "NewHHASurveyController"
                            }
                        }
                    })

                    .state("app.hha.hha_coping_strategies", {
                        url: "hha_coping_strategies",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hha/hha_coping_strategies.html",
                                controller: "NewHHASurveyController"
                            }
                        }
                    })


                    .state("app.hha.hha_livelihood_coping", {
                        url: "hha_livelihood_coping",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hha/hha_livelihood_copings.html",
                                controller: "NewHHASurveyController"
                            }
                        }
                    })

                    .state("app.hha.hha_nutrition", {
                        url: "hha_nutrition",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hha/hha_nutrition.html",
                                controller: "NewHHASurveyController"
                            }
                        }
                    })

                    .state("app.hha.hha_nutrition_status", {
                        url: "hha_nutrition_status",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hha/children_nutrition.html",
                                controller: "NewHHASurveyController"
                            }
                        }
                    });
        });
