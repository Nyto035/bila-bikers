angular.module("hsna.controllers", [])



        .controller("HSNAListController", ["$ionicLoading", "$ionicPopup", "$rootScope", "$scope", "$state", "HsnaService", "OptionService", "LocationService", "SYNC_EVENTS",
            function ($ionicLoading, $ionicPopup, $rootScope, $scope, $state, HsnaService, OptionService, LocationService, SYNC_EVENTS) {

                $scope.showSyncButton(true);

                $scope.refresh = function () {

                    HsnaService.getAll().then(function (results) {
                        $scope.surveys = [];
                        if (results.rows.length > 0) {
                            for (var i = 0; i < results.rows.length; i++) {
                                $scope.surveys.push(results.rows.item(i));
                                $scope.surveys[i].interview_date = new Date($scope.surveys[i].interview_date).getTime();
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


                $scope.createHSNA = function () {
                    // TODO Bring back once complete saving locally
                    var hsna = {};
                    $ionicLoading.show();
                    LocationService.getLocation().then(function (position) {

                        OptionService.getOptions().then(function (results) {
                            console.log(results);
                            if (results.rows.length > 0) {
                                hsna.lat = position.coords.latitude;
                                hsna.long = position.coords.longitude;
                                HsnaService.create(hsna).then(function (results) {
                                    HsnaService.setDefaultValues(results.insertId).then(function (survey) {
                                        $state.go('app.hsna.hsna_household', {'id': results.insertId});
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
                            template: "Ensure GPS is enabled, you are in an open field and try restaring your device.<br>(Code: " + error.code + "<br>Message: " + error.message + ")"
                        });
                        console.log(error);
                    });
                }


                $scope.onDelete = function (survey) {
                    if (confirm('Are you sure you want to delete this survey?')) {
                        HsnaService.deleteSurvey(survey.id).then(function () {
                            $scope.refresh();
                        }, function (error) {
                            alert(error);
                            console.log(error);
                        });
                    }
                };

            }])

        .controller("NewHSNASurveyController", ["$scope", "$ionicPopup", "$state", "OptionService", "HsnaService",
            function ($scope, $ionicPopup, $state, OptionService, HsnaService) {
                $scope.title = "New HSNA Survey";

                $scope.currDate = new Date();

                $scope.showSyncButton(false);

                $scope.governmentOgrs = [
                    { 'name': 'OVC (pesa za yatima)', 'value': 'ovc' },
                    { 'name': 'OP (pesa za wazee)', 'value': 'op' },
                    { 'name': 'PWSD (pesa za walemavu)', 'value': 'pwsd' },
                    { 'name': 'HSNP-CT (lopetun)', 'value': 'hsnp' },
                ];

                $scope.months = [
                    { 'name': 'January', 'value': 'jan' },
                    { 'name': 'February', 'value': 'feb' },
                    { 'name': 'March', 'value': 'mar' },
                    { 'name': 'April', 'value': 'apr' },
                    { 'name': 'May', 'value': 'may' },
                    { 'name': 'June', 'value': 'jun' },
                ];

                $scope.totalReceived = function() {
                    $scope.survey.total_received = 0;
                    _.each($scope.months, function(mon) {
                        $scope.survey.total_received += $scope.survey[mon.value];
                    });
                };

                $scope.infoSources = HsnaService.infoSources();

                $scope.foodItems = HsnaService.foodItems();

                $scope.nonFoodItems = HsnaService.nonFoodItems();

                $scope.assistanceTypes = HsnaService.assistanceReceived();

                HsnaService.getById($state.params.id).then(function (results) {
                    if (results.rows.length > 0) {
                        var survey = results.rows.item(0);
                        survey.interview_date = new Date(survey.interview_date);
                        $scope.survey = survey;
                        $scope.onCountySelected();
                        $scope.onSubCountySelected();
                        $scope.onSentinelSiteSelected();
                        console.log($scope.survey);
                    } else {
                        $state.go('app.hsna');
                    }
                }, function (error) {
                    console.log(error);
                    $state.go('app.hsna');
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
                    $scope.validation_errors = HsnaService.validate(section, $scope.survey);
                    if (!_.isEmpty($scope.validation_errors)) {
                        console.log($scope.validation_errors);
                        $ionicPopup.alert({
                            title: 'Validation Erros',
                            template: "Please correct the " + $scope.validation_errors.length + " validation error(s) and try again!"
                        });
                        return;
                    }
                    HsnaService.update(section, $scope.survey).then(function (results) {
                        if (HsnaService.getNextSection(section)) {
                            $state.go(HsnaService.getNextSection(section), {'id': $scope.survey.id});
                        } else {
                            if ($scope.survey.status === "Draft") {

                                $scope.survey.status = "Completed";
                                HsnaService.update(section, $scope.survey).then(function () {
                                    $ionicPopup.alert({
                                        title: 'HSNA Survey Completed',
                                        template: "Survey has been completed successfully!"
                                    }).then(function () {
                                        $state.go('app.hsna');
                                    }, function (error) {
                                        console.log(error);
                                    });

                                }, function (error) {
                                    console.log(error);
                                });



                            } else {
                                $state.go('app.hsna');
                            }


                        }
                    }, function (error) {
                        console.log(error);
                    });
                    ;
                };

                $scope.onPrevious = function (section) {
                    $scope.validation_errors = HsnaService.validate(section, $scope.survey);
                    if (!_.isEmpty($scope.validation_errors)) {
                        console.log($scope.validation_errors);
                        $ionicPopup.alert({
                            title: 'Validation Erros',
                            template: "Please correct the " + $scope.validation_errors.length + " validation error(s) and try again!"
                        });
                        return;
                    }
                    HsnaService.update(section, $scope.survey).then(function (results) {
                        if (HsnaService.getPreviousSection(section)) {
                            $state.go(HsnaService.getPreviousSection(section), {'id': $scope.survey.id});
                        } else {
                            $state.go('app.hsna');
                        }
                    }, function (error) {
                        console.log(error);
                    });
                    ;
                };

            }]);


