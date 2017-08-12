angular.module('app.states.kia', [])

        .config(function ($stateProvider) {
            $stateProvider

                    .state('app.kia', {
                        url: 'kia/',
                        views: {
                            'survey-content': {
                                templateUrl: 'templates/kia/list.html',
                                controller: "KIAListController"
                            }
                        }
                    })

                    .state('app.kia.kia_background', {
                        url: "background/:id",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/kia/kia_background.html",
                                controller: "NewKIASurveyController"
                            }
                        }
                    })

                    .state('app.kia.kia_rainfall', {
                        url: "rainfall/:id",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/kia/kia_rainfall.html",
                                controller: "NewKIASurveyController"
                            }
                        }
                    })

                    .state('app.kia.kia_water_resources', {
                        url: "water-resources/:id",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/kia/kia_water_resources.html",
                                controller: "NewKIASurveyController"
                            }
                        }
                    })

                    .state('app.kia.kia_forage_condition', {
                        url: "forage-condition/:id",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/kia/kia_forage_condition.html",
                                controller: "NewKIASurveyController"
                            }
                        }
                    })

                    .state('app.kia.kia_migration', {
                        url: "migration/:id",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/kia/kia_migration.html",
                                controller: "NewKIASurveyController"
                            }
                        }
                    })

                    .state('app.kia.kia_livestock_prices', {
                        url: "livestock_prices/:id",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/kia/kia_livestock_prices.html",
                                controller: "NewKIASurveyController"
                            }
                        }
                    })

                    .state('app.kia.kia_food_prices', {
                        url: "food_prices/:id",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/kia/kia_food_prices.html",
                                controller: "NewKIASurveyController"
                            }
                        }
                    })

                    .state('app.kia.kia_human_diseases', {
                        url: "human_diseases/:id",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/kia/kia_human_diseases.html",
                                controller: "NewKIASurveyController"
                            }
                        }
                    })

                    .state('app.kia.kia_livestock_production', {
                        url: "livestock_production/:id",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/kia/kia_livestock_production.html",
                                controller: "NewKIASurveyController"
                            }
                        }
                    })

                    .state('app.kia.kia_rainfed_production', {
                        url: "rainfed_production/:id",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/kia/kia_rainfed_production.html",
                                controller: "NewKIASurveyController"
                            }
                        }
                    })

                    ;
        });