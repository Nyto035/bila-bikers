(function (angular) {
    angular.module("app.services.content", [])

            .constant("OPTIONS_URI", "questions/options/")

            .service("ContentSync", ["$http", "$cordovaSQLite", "$ionicLoading", "SERVER_URL", "OPTIONS_URI",
                function ($http, $cordovaSQLite, $ionicLoading, SERVER_URL, OPTIONS_URI) {


                    function escapeStringForDatabase(str) {
                        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
                            switch (char) {
                                case "\0":
                                    return "\\0";
                                case "\x08":
                                    return "\\b";
                                case "\x09":
                                    return "\\t";
                                case "\x1a":
                                    return "\\z";
                                case "\n":
                                    return "\\n";
                                case "\r":
                                    return "\\r";
                                case "\"":
                                case "'":
                                    return "`";
                                case "\\":
                                case "%":
                                    return "\\" + char; // prepends a backslash to backslash, percent,
                                    // and double/single quotes
                            }
                        });
                    }


                    this.synchronize = function () {
                        $ionicLoading.show();

//                        $http.get(SERVER_URL + OPTIONS_URI).success(function (response) {
//
//                            //Clear the options
//                            $cordovaSQLite.execute(DB, "DELETE FROM options");
//
//                            for (var i = 0; i < response.Results.length; i++) {
//                                var option = response.Results[i];
//
//
//                                $cordovaSQLite.execute(DB,
//                                        "INSERT INTO options (id, wording, parent, group_name, parent_group ) VALUES (?,?,?,?,?)",
//                                        [option.Id, option.Wording, option.Parent, option.GroupName, option.ParentGroup]).then(function () {
//                                    console.log(i + "/" + response.Results.length);
//                                }, function (error) {
//                                    console.log(error);
//                                });
//
//                            }
//                        }).error(function (error) {
//                            console.log(error);
//                        });



                        $http.get(SERVER_URL + OPTIONS_URI).success(function (response) {

                            //Clear the options
                            $cordovaSQLite.execute(DB, "DELETE FROM options").then(function (results) {
                                var values = "";

                                var toDBValue = function (value) {
                                    if (value === null || value === "null" || _.isUndefined(value)) {
                                        return "''";
                                    }
                                    var newValue = escapeStringForDatabase(value);
                                    return "'" + newValue + "'";
                                };

                                var toLivelihoodZoneID = function (value) {
                                    if (value === null || value === "null" || _.isUndefined(value)) {
                                        return "null";
                                    }
                                    return parseInt(value, 10);
                                };



                                _.each(response.Results, function (option) {
                                    values += "(" + option.Id + ", "
                                            + toLivelihoodZoneID(option.LivelihoodZone) + ", "
                                            + toDBValue(option.HouseholdName) + ", "
                                            + toDBValue(option.Wording) + ", "
                                            + toDBValue(option.Parent) + ", "
                                            + toDBValue(option.GroupName) + ", "
                                            + toDBValue(option.ParentGroup) + "), ";
                                });

                                values = values.trim().slice(0, -1);


                                $cordovaSQLite.execute(DB, "INSERT INTO options (id, livelihood_zone_id, household_name, wording, parent, group_name, parent_group ) VALUES " + values + ";").then(function (results) {
                                    $ionicLoading.hide();
                                    console.log(results);
                                }, function (error) {
                                    console.log(error);
                                    $ionicLoading.hide();
                                });
                            }, function (error) {
                                console.log(error);
                            });




                        }).error(function (error) {
                            console.log(error);
                            $ionicLoading.hide();
                        });
                    };
                }])

            .service("SurveySync", ["$http", "$cordovaSQLite", "$ionicPopup", "SERVER_URL", "KiaService", "HHAService",
                function ($http, $cordovaSQLite, $ionicPopup, SERVER_URL, KiaService, HHAService) {
                    var KIA_URI = "responses/kia/";
                    var HHA_URI = "responses/hha/";


                    this.synchronize = function (onUpdate) {
                        onUpdate("Synchronizing ...");

                        var completedSurveys = [];

                        var syncErrorShow = false;


                        var postSurvey = function (survey) {
                            $http.post(SERVER_URL + survey.serverUri, survey.response).then(function (response) {


                                survey.response['status'] = 'Synchronized';
                                survey.response['qid'] = response.data.Qid;

                                survey.response['sync_failed_error_code'] = null;
                                survey.response['sync_failed_status_text'] = null;

                                if (survey.questionnaire === "HHA") {
                                    HHAService.update("All", survey.response).then(function (response) {
                                        onUpdate("Synchronize");
                                    }, function (error) {
                                        onUpdate("Synchronize");
                                        console.log(error);
                                    });

                                } else if (survey.questionnaire === "KIA") {
                                    KiaService.update("All", survey.response).then(function (response) {
                                        onUpdate("Synchronize");
                                    }, function (error) {
                                        onUpdate("Synchronize");
                                        console.log(error);
                                    });
                                }


                            }, function (error) {
                                onUpdate("Synchronize");

                                if (error.status === -1 && !syncErrorShow) {
                                    syncErrorShow = true;
                                    $ionicPopup.alert({
                                        title: 'Network Error (-1)',
                                        template: "Please ensure you have internet access and try again!"
                                    });
                                }

                                if (error.status === 401 && !syncErrorShow) {
                                    syncErrorShow = true;
                                    $ionicPopup.alert({
                                        title: 'Not Authorised (401)',
                                        template: "Please log out, then login and try again!"
                                    });
                                }

                                survey.response['status'] = 'Sync Failed';
                                survey.response['sync_failed_error_code'] = error.status;
                                survey.response['sync_failed_status_text'] = error.statusText;

                                console.log(error.statusText);

                                update(survey);


                            });
                        };


                        var update = function (survey) {
                            if (survey.questionnaire === "HHA") {
                                HHAService.update("All", survey.response).then(function (response) {
                                    onUpdate("Synchronize");
                                }, function (error) {
                                    onUpdate("Synchronize");
                                    console.log(error);
                                });

                            } else if (survey.questionnaire === "KIA") {
                                KiaService.update("All", survey.response).then(function (response) {
                                    onUpdate("Synchronize");
                                }, function (error) {
                                    onUpdate("Synchronize");
                                    console.log(error);
                                });
                            }

                        };





                        var updateSurvey = function (survey) {
                            $http.put(SERVER_URL + survey.serverUri + survey.response.qid + "/", survey.response).then(function (response) {


                                survey.response['status'] = 'Synchronized';
                                survey.response['sync_failed_error_code'] = null;
                                survey.response['sync_failed_status_text'] = null;

                                update(survey);


                            }, function (error) {
                                onUpdate("Synchronize");

                                console.log(error);

                                if (error.status === -1 && !syncErrorShow) {
                                    syncErrorShow = true;
                                    $ionicPopup.alert({
                                        title: 'Network Error (-1)',
                                        template: "Please ensure you have internet access and try again!"
                                    });

                                }

                                if (error.status === 401 && !syncErrorShow) {
                                    syncErrorShow = true;
                                    $ionicPopup.alert({
                                        title: 'Not Authorised (401)',
                                        template: "Please log out, then login and try again!"
                                    });

                                }

                                if (error.status === -1) {
                                    error.statusText = "NETWORK ERROR";
                                }

                                //**Temporary workaround for fooling the client
                                survey.response['status'] = 'Sync Failed';
                                survey.response['sync_failed_error_code'] = error.status;
                                survey.response['sync_failed_status_text'] = error.statusText;

                                update(survey);
                                //**End of temporary workaround


                                console.log(error);
                            });
                        };





                        var synchronize = function () {
                            _.each(completedSurveys, function (survey) {

                                survey.response['status'] = 'Synchronizing ...';

                                if (!survey.response['mode_of_collection'] || survey.response['mode_of_collection'] === null || survey.response['mode_of_collection'] === 'null') {
                                    survey.response['mode_of_collection'] = 'Mobile App';
                                }

                                update(survey);

                                if (survey.response.qid === null || survey.response.qid === "null") {
                                    postSurvey(survey);
                                } else {
                                    updateSurvey(survey);
                                }

                            });
                        };


                        var populateCompletedHHAs = function () {
                            HHAService.getCompleted().then(function (results) {
                                for (var i = 0; i < results.rows.length; i++) {
                                    completedSurveys.push({
                                        questionnaire: "HHA",
                                        response: results.rows.item(i),
                                        serverUri: HHA_URI
                                    });
                                }

                                synchronize();
                            }, function (error) {
                                console.log(error);
                                synchronize();
                            });
                        };

                        KiaService.getCompleted().then(function (results) {
                            for (var i = 0; i < results.rows.length; i++) {
                                completedSurveys.push({
                                    questionnaire: "KIA",
                                    response: results.rows.item(i),
                                    serverUri: KIA_URI
                                });
                            }

                            populateCompletedHHAs();

                        }, function (error) {
                            console.log(error);
                            populateCompletedHHAs();
                        });


                        KiaService.getCompleted().then(function (results) {
                            if (results.rows.length > 0) {
                                for (var i = 0; i < results.rows.length; i++) {

                                    var survey = results.rows.item(i);
                                    if (survey.qid !== null) {
                                        $http.put(SERVER_URL + KIA_URI + survey.qid + "/", survey).then(function (response) {
                                            onUpdate("KIA (" + (i + 1) + "/" + results.rows.length + ")");

                                            survey['status'] = 'Synchronized';
                                            KiaService.update("All", survey).then(function (response) {
                                                onUpdate("Synchronize");
                                            }, function (error) {
                                                console.log(error);
                                            });

                                        }, function (error) {
                                            onUpdate("Synchronize");
                                            console.log(error);
                                        });
                                    } else {
                                        $http.post(SERVER_URL + KIA_URI, survey).then(function (response) {

                                            survey['status'] = 'Synchronized';
                                            KiaService.update("All", survey).then(function (response) {
                                                onUpdate("KIA (" + (i + 1) + "/" + results.rows.length + ")");
                                            }, function (error) {
                                                onUpdate("Synchronize");
                                                console.log(error);
                                            });

                                            $cordovaSQLite.execute(DB, "UPDATE kia SET qid=" + response.data.Qid + " WHERE id=" + survey.id).then(function (results) {

                                            }, function (error) {
                                                console.log(error);
                                            });


                                        }, function (error) {
                                            console.log("Inside on error");
                                            onUpdate("Synchronize");
                                            console.log(error);
                                        });
                                    }

                                }
                            }
                        }, function (error) {
                            console.log(error);
                        });

                        onUpdate("Synchronize");

                    };
                }]);
})(window.angular);


