angular.module("kia.controllers", [])

        .controller("KIAListController", ["$ionicPopup", "$ionicLoading", "$rootScope", "$scope", "$state",
            "KiaService", "OptionService", "SYNC_EVENTS", "LocationService",
            function ($ionicPopup, $ionicLoading, $rootScope, $scope, $state,
                    KiaService, OptionService, SYNC_EVENTS, LocationService) {


                $scope.showSyncButton(true);

                $scope.refresh = function () {

                    KiaService.getAll().then(function (results) {
                        $scope.surveys = [];
                        if (results.rows.length > 0) {
                            for (var i = 0; i < results.rows.length; i++) {
                                $scope.surveys.push(results.rows.item(i));
                            }
                        }
                    }, function (error) {
                        console.log(error);
                    });
                };
                $scope.refresh();

                $rootScope.$on(SYNC_EVENTS.on_sync_response, function () {
                    $scope.refresh();
                });


                $scope.onNewSurvey = function () {

                    $ionicLoading.show();


                    LocationService.getLocation().then(function (position) {

                        OptionService.getOptions().then(function (results) {
                            console.log(results);
                            if (results.rows.length > 0) {

                                KiaService.create(position.coords).then(function (results) {
                                    KiaService.setDefaultValues(results.insertId).then(function (survey) {
                                        $state.go('app.kia.kia_background', {'id': results.insertId});
                                        $scope.refresh();
                                    }, function (error) {
                                        console.log(error);
                                    });

                                }, function (error) {
                                    console.log(error);
                                });

                            } else {
                                $ionicPopup.alert({
                                    title: 'App not updated!',
                                    template: "Please click on Menu (the three bars on top left corner) then click update"
                                });
                            }

                        }, function (error) {
                            console.log(error);
                        });

                        $ionicLoading.hide();


                    }, function (error) {

                        $ionicLoading.hide();

                        $ionicPopup.alert({
                            title: 'Unable to determine location!',
                            template: "Ensure GPS is enabled, you are in an open field and try restarting your device.<br>(Code: " + error.code + "<br>Message: " + error.message + ")"
                        });
                        console.log(error);
                    });

                };


                $scope.onDelete = function (survey) {
                    if (confirm('Are you sure you want to delete this survey?')) {
                        KiaService.deleteSurvey(survey.id).then(function () {
                            $scope.refresh();
                        }, function (error) {
                            alert(error);
                            console.log(error);
                        });
                    }
                };
            }])

        .controller("NewKIASurveyController", ["$scope", "$ionicPopup", "$state", "OptionService", "KiaService",
            function ($scope, $ionicPopup, $state, OptionService, KiaService) {
                $scope.title = "New KIA Survey";

                $scope.showSyncButton(false);

                KiaService.getById($state.params.id).then(function (results) {
                    if (results.rows.length > 0) {
                        var survey = results.rows.item(0);
                        survey.interview_date = new Date(survey.interview_date);
                        $scope.survey = survey;
                        $scope.onCountySelected();
                        $scope.onSubCountySelected();
                        $scope.onSentinelSiteSelected();
                        console.log($scope.survey);
                    } else {
                        $state.go('app.kia');
                    }
                }, function (error) {
                    console.log(error);
                    $state.go('app.kia');
                });

                $scope.counties = OptionService.getByGroup("COUNTY");

                $scope.onCountySelected = function () {
                    $scope.subCounties = OptionService.getByGroupAndParent("SUB_COUNTY", $scope.survey.county);
                    $scope.markets = OptionService.getByGroupAndParent("MARKETS", $scope.survey.county);
                };

                $scope.onSubCountySelected = function () {
                    $scope.sentinelSites = OptionService.getByGroupAndParent("SENTINEL_SITE", $scope.survey.sub_county);
                };

                $scope.onSentinelSiteSelected = function () {
                    OptionService.getByGroupAndID("SENTINEL_SITE", $scope.survey.site).then(function (results) {
                        if (results.rows.length > 0) {
                            $scope.communities = OptionService.getByGroupAndParent("COMMUNITIES", results.rows.item(0).wording);

                        } else {
                            $scope.communities = [];
                        }
                    }, function (error) {
                        console.log(error);
                    });
                };



                $scope.onSubmit = function (section) {
                    $scope.validation_errors = KiaService.validate(section, $scope.survey);
                    if (!_.isEmpty($scope.validation_errors)) {
                        console.log($scope.validation_errors);
                        $ionicPopup.alert({
                            title: 'Validation Erros',
                            template: "Please correct the " + $scope.validation_errors.length + " validation error(s) and try again!"
                        });
                        return;
                    }
                    KiaService.update(section, $scope.survey).then(function (results) {
                        if (KiaService.getNextSection(section)) {
                            $state.go(KiaService.getNextSection(section), {'id': $scope.survey.id});
                        } else {
                            if ($scope.survey.status === "Draft") {

                                $scope.survey.status = "Completed";
                                KiaService.update(section, $scope.survey).then(function () {
                                    $ionicPopup.alert({
                                        title: 'KIA Survey Completed',
                                        template: "Survey has been completed successfully!"
                                    }).then(function () {
                                        $state.go('app.kia');
                                    }, function (error) {
                                        console.log(error);
                                    });

                                }, function (error) {
                                    console.log(error);
                                });



                            } else {
                                $state.go('app.kia');
                            }


                        }
                    }, function (error) {
                        console.log(error);
                    });
                    ;
                };

                $scope.onPrevious = function (section) {
                    $scope.validation_errors = KiaService.validate(section, $scope.survey);
                    if (!_.isEmpty($scope.validation_errors)) {
                        console.log($scope.validation_errors);
                        $ionicPopup.alert({
                            title: 'Validation Erros',
                            template: "Please correct the " + $scope.validation_errors.length + " validation error(s) and try again!"
                        });
                        return;
                    }
                    KiaService.update(section, $scope.survey).then(function (results) {
                        if (KiaService.getPreviousSection(section)) {
                            $state.go(KiaService.getPreviousSection(section), {'id': $scope.survey.id});
                        } else {
                            $state.go('app.kia');
                        }
                    }, function (error) {
                        console.log(error);
                    });
                    ;
                };

            }]);
