angular.module("hha.controllers", [])



        .controller("HHAListController", ["$ionicLoading", "$ionicPopup", "$rootScope", "$scope", "$state", "HHAService", "OptionService", "LocationService", "SYNC_EVENTS",
            function ($ionicLoading, $ionicPopup, $rootScope, $scope, $state, HHAService, OptionService, LocationService, SYNC_EVENTS) {

                $scope.showSyncButton(true);

                $scope.refresh = function () {

                    HHAService.getAll().then(function (results) {
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


                $scope.createHHA = function () {

                    var hha = {};
                    $ionicLoading.show();
                    LocationService.getLocation().then(function (position) {

                        OptionService.getOptions().then(function (results) {
                            console.log(results);
                            if (results.rows.length > 0) {
                                hha.lat = position.coords.latitude;
                                hha.long = position.coords.longitude;
                                HHAService.createHHA(hha).then(function (results) {
                                    HHAService.setDefaultValues(results.insertId).then(function (survey) {
                                        $state.go('app.hha.new_hha', {'id': results.insertId});
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
                        HHAService.deleteSurvey(survey.id).then(function () {
                            $scope.refresh();
                        }, function (error) {
                            alert(error);
                            console.log(error);
                        });
                    }
                };

            }])

        .controller("NewHHASurveyController", ["$ionicPopup", "$scope", "OptionService", "$state", "HHAService", "AuthService",
            function ($ionicPopup, $scope, OptionService, $state, HHAService, AuthService) {
                $scope.title = "New HHA Survey";

                $scope.showSyncButton(false);

                $scope.animals = HHAService.animals();
                $scope.cereals = HHAService.cereals();

                $scope.milk_animals = HHAService.milk_animals;

                $scope.food_sources = HHAService.food_sources;
                $scope.zero_to_seven = HHAService.zero_to_seven;

                $scope.edit = $state.params.id ? true : false;

                $scope.counties = OptionService.getByGroup("COUNTY");
                $scope.livelihoodZones = OptionService.getByGroup("LIVELIHOOD_ZONE");

                $scope.who_drank_milk_options = OptionService.getByGroup("WHO_DRANK_MILK");

                $scope.onCountySelected = function () {
                    $scope.subCounties = OptionService.getByGroupAndParent("SUB_COUNTY", $scope.section.county);
                };

                $scope.onSubCountySelected = function () {
                    $scope.sentinelSites = OptionService.getByGroupAndParent("SENTINEL_SITE", $scope.section.sub_county);
                };


                $scope.onHouseholdSelected = function () {


                    OptionService.getByGroupAndWording("HOUSEHOLDS", $scope.section.household_code).then(function (results) {
                        if (results.rows.length > 0) {
                            var household = results.rows.item(0);
                            if (household.household_name !== null) {
                                $scope.section.household_name = household.household_name;
                            }

                        }
                    }, function (error) {
                        console.log(error);
                    });

                };

                $scope.onSentinelSiteSelected = function () {
                    OptionService.getByGroupAndID("SENTINEL_SITE", $scope.section.site).then(function (results) {
                        if (results.rows.length > 0) {
                            var sentinelSite = results.rows.item(0);
                            if (sentinelSite.livelihood_zone_id !== null) {
                                $scope.section.livelihood_zone = sentinelSite.livelihood_zone_id;
                                $scope.livelihoodZoneEditable = false;
                            } else {
                                $scope.livelihoodZoneEditable = true;
                            }

                            $scope.households = OptionService.getByGroupAndParent("HOUSEHOLDS", results.rows.item(0).wording);

                        } else {
                            $scope.households = [];
                        }
                    }, function (error) {
                        console.log(error);
                    });

                };




                if ($scope.edit) {
                    HHAService.getHHA($state.params.id)
                            .then(function (res) {

                                var survey = res.rows.item(0);

                                console.log(survey);

                                $scope.section = survey;
                                $scope.section.interview_date = new Date($scope.section.interview_date);


                                angular.forEach($scope.section, function (value, key) {
                                    if (value === "true") {
                                        $scope.section[key] = true;
                                    } else if (value === "false") {
                                        $scope.section[key] = false;
                                    } else if (value === "null") {
                                        $scope.section[key] = null;
                                    }
                                });



                                console.log($scope.section.camels);
                                $scope.onCountySelected();
                                $scope.onSubCountySelected();
                                $scope.onSentinelSiteSelected();
                            }, function (error) {
                                console.log(error);
                            });
                }




                $scope.onSubmit = function (sectionName) {

                    $scope.validation_errors = HHAService.validate(sectionName, $scope.section);
                    if (!_.isEmpty($scope.validation_errors)) {
                        console.log($scope.validation_errors);
                        $ionicPopup.alert({
                            title: 'Validation Erros',
                            template: "Please correct the " + $scope.validation_errors.length + " validation error(s) and try again!"
                        });
                        return;
                    }
                    HHAService.update(sectionName, $scope.section).then(function (results) {


                        if (HHAService.getNextSection(sectionName)) {
                            $state.go(HHAService.getNextSection(sectionName), {'id': $scope.section.id});
                        } else {
                            if ($scope.section.status === "Draft") {

                                $scope.section.status = "Completed";
                                HHAService.update(sectionName, $scope.section).then(function () {
                                    $ionicPopup.alert({
                                        title: 'HHA Survey Completed',
                                        template: "Survey has been completed successfully!"
                                    }).then(function () {
                                        $state.go('app.hha');
                                    }, function (error) {
                                        console.log(error);
                                    });

                                }, function (error) {
                                    console.log(error);
                                });
//                            } else if ($scope.section.status === "Completed" || $scope.section.status === "Synchronized" || $scope.section.status === "Sync Failed") {

                            } else if ($scope.section.status === "Completed") {
                                $scope.section.status = "Completed";
                                HHAService.update(sectionName, $scope.section).then(function () {
                                    $ionicPopup.alert({
                                        title: 'HHA Survey Saved',
                                        template: "Survey has been saved successfully!"
                                    }).then(function () {
                                        $state.go('app.hha');
                                    }, function (error) {
                                        console.log(error);
                                    });

                                }, function (error) {
                                    console.log(error);
                                });
                            } else {
                                $state.go('app.hha');
                            }


                        }
                    }, function (error) {
                        console.log(error);
                    });
                    ;
                };



                $scope.onPrevious = function (sectionName) {
                    $scope.validation_errors = HHAService.validate(sectionName, $scope.section);
                    if (!_.isEmpty($scope.validation_errors)) {
                        console.log($scope.validation_errors);
                        $ionicPopup.alert({
                            title: 'Validation Erros',
                            template: "Please correct the " + $scope.validation_errors.length + " validation error(s) and try again!"
                        });
                        return;
                    }
                    HHAService.update(sectionName, $scope.section).then(function (results) {
                        if (HHAService.getPreviousSection(sectionName)) {
                            $state.go(HHAService.getPreviousSection(sectionName), {'id': $scope.section.id});
                        } else {
                            $state.go('app.hha');
                        }
                    }, function (error) {
                        console.log(error);
                    });
                    ;
                };


            }]);


