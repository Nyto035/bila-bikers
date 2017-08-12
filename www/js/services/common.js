
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function (angular) {
    angular.module("app.services.common", [])



            .service("NotificationService", ["$ionicPopup", function ($ionicPopup) {
                    this.showError = function (error) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: error
                        });
                    };

                    this.showError = function (title, error) {
                        $ionicPopup.alert({
                            title: title,
                            template: error
                        });
                    };
                }])

            .service("LocationService", ["$cordovaGeolocation", "$q", "GPS_OPTIONS", function ($cordovaGeolocation, $q, GPS_OPTIONS) {

                    this.getLocation = function () {

                        var deferred = $q.defer();


                        var watch = $cordovaGeolocation.watchPosition(GPS_OPTIONS);

                        var clearWatch = function () {
                            watch.clearWatch();
                        };

                        watch.then(null, function (error) {
                            deferred.reject(error);
                            clearWatch();
                        }, function (position) {
                            deferred.resolve(position);
                            clearWatch();
                        });

                        return deferred.promise;

                    };



                }])


            .service("CommonService", ["$cordovaSQLite", "DBService", "DEBUG",
                function ($cordovaSQLite, DBService, DEBUG) {

                    this.validate = function (section, survey, questionnaire) {
                        var validation_errors = [];

                        var fields = [];

                        if (questionnaire === "HHA") {
                            fields = DBService.getHHAFields();
                        } else if (questionnaire === "KIA") {
                            fields = DBService.getKIAFields();
                        }

                        _.each(fields, function (field) {
                            if (field.section === section) {
                                if (field.required) {
                                    if (_.isNull(survey[field.field_name]) || _.isUndefined(survey[field.field_name]) || survey[field.field_name] === 'null') {
                                        if (field.verbose_name) {
                                            validation_errors.push({field: field.field_name,
                                                message: field.verbose_name + ' is required!'});
                                        } else {
                                            validation_errors.push({field: field.field_name,
                                                message: field.field_name + ' is required!'});
                                        }
                                    }


                                }

                                if (!_.isNull(survey[field.field_name]) && !_.isUndefined(field.minimum_value)) {
                                    if (parseFloat(survey[field.field_name]) < field.minimum_value) {
                                        validation_errors.push({field: field.field_name,
                                            message: 'Minimum value for this field is ' + field.minimum_value});
                                    }
                                }

                                if (!_.isNull(survey[field.field_name]) && field.maximum_value) {
                                    if (parseFloat(survey[field.field_name]) > field.maximum_value) {
                                        validation_errors.push({field: field.field_name,
                                            message: 'Maximum value for this field is ' + field.maximum_value});
                                    }
                                }

                                if (_.isFunction(field.validate)) {
                                    field.validate(survey, validation_errors);
                                }


                            }


                            ;
                        });

                        return validation_errors;

                    };


                    this.getCompleted = function (questionnaire) {
                        var relation = 'hha';
                        if (questionnaire === "HHA") {
                            relation = 'hha';
                        } else if (questionnaire === "KIA") {
                            relation = 'kia';
                        }


                        if (DEBUG) {
                            return $cordovaSQLite.execute(DB, "SELECT * FROM " + relation);
                        }

                        return $cordovaSQLite.execute(DB, "SELECT * FROM " + relation + " WHERE status NOT IN ('Draft' ,'Synchronized')");
                    };




                    this.update = function (survey, section, questionnaire) {


                        var section_fields = [];
                        var questionnaire_fields = [];

                        if (questionnaire === "HHA") {
                            questionnaire_fields = DBService.getHHAFields();
                        } else {
                            questionnaire_fields = DBService.getKIAFields();
                        }

                        _.each(questionnaire_fields, function (field) {
                            if (field.section === section || field.section === 'All') {
                                section_fields.push(field);
                            }
                        });



                        var updated_values = section_fields.map(function (field) {
                            if (field.data_type === 'number') {
                                if (!isNaN(parseInt((survey[field.field_name]), 10))) {
                                    return field.field_name + "=" + parseInt(survey[field.field_name], 10);
                                } else {
                                    console.log("Error parsing value to integer: " + survey[field.field_name] + " for field " + field.field_name);
                                    return field.field_name + "=null";
                                }
                            } else if (field.data_type === 'float') {
                                if (!isNaN(parseFloat(survey[field.field_name]))) {
                                    return field.field_name + "=" + parseFloat(survey[field.field_name]);
                                } else {
                                    console.log("Error parsing value to float: " + survey[field.field_name] + " for field " + field.field_name);
                                    return field.field_name + "=null";
                                }
                            } else if (field.data_type === 'date') {
                                return field.field_name + "='" + survey[field.field_name].toISOString() + "'";
                            } else if ((survey[field.field_name] + '').trim().length < 1 && field.data_type === 'text') {
                                return field.field_name + "=null";
                            } else if (field.data_type === 'text' && _.isUndefined(survey[field.field_name])) {
                                return field.field_name + "=null";
                            } else if (field.data_type === 'text' && (survey[field.field_name] === null || survey[field.field_name] === 'null' || survey[field.field_name] === 'undefined')) {
                                return field.field_name + "=null";
                            } else if (field.data_type === 'boolean' && (survey[field.field_name] === true || survey[field.field_name] === 'true')) {
                                return field.field_name + "=1";
                            } else if (field.data_type === 'boolean' && (survey[field.field_name] === false || survey[field.field_name] === 'false' || survey[field.field_name] === 'undefined')) {
                                return field.field_name + "=0";
                            }
                            return field.field_name + "='" + survey[field.field_name] + "'";
                        });

                        if (questionnaire === "HHA") {
                            var query = "UPDATE hha SET " + updated_values.join(",") +
                                    " WHERE id=" + survey.id;
                        } else {
                            var query = "UPDATE kia SET " + updated_values.join(",") +
                                    " WHERE id=" + survey.id;
                        }


                        console.log(query);
                        return $cordovaSQLite.execute(DB, query, null);
                    };

                }
            ]);
})(window.angular);


