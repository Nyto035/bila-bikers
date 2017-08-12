angular.module('app.states.hsna', [])

        .config(function ($stateProvider) {
            $stateProvider

                    .state('app.hsna', {
                        url: 'hsna/?id',
                        views: {
                            'survey-content': {
                                templateUrl: 'templates/hsna/list.html',
                                controller: "HSNAListController"
                            }
                        }
                    })

                    .state('app.hsna.hsna_household', {
                        url: "house_hold/",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hsna/hsna_household.html",
                                controller: "NewHSNASurveyController"
                            }
                        }
                    })

                    .state('app.hsna.hsna_generalcash', {
                        url: "general_cash/",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hsna/hsna_generalcash.html",
                                controller: "NewHSNASurveyController"
                            }
                        }
                    })

                    .state('app.hsna.hsna_cashpayments', {
                        url: "cash_payments/",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hsna/hsna_cash_payment.html",
                                controller: "NewHSNASurveyController"
                            }
                        }
                    })

                    .state('app.hsna.hsna_paymentutilization', {
                        url: "payment_utilization/",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hsna/hsna_paymentutilization.html",
                                controller: "NewHSNASurveyController"
                            }
                        }
                    })

                    .state('app.hsna.hsna_assistance_received', {
                        url: "assistance_received/",
                        views: {
                            'survey-content@app': {
                                templateUrl: "templates/hsna/hsna_assistance_received.html",
                                controller: "NewHSNASurveyController"
                            }
                        }
                    })

                    ;
        });
