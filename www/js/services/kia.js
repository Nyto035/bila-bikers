(function (angular) {
    angular.module("app.services.kia", [])

            .service("KiaService", ["$cordovaSQLite", "DBService", "CommonService",
                function ($cordovaSQLite, DBService, CommonService) {

                    this.create = function (gps) {
                        return $cordovaSQLite.execute(DB,
                                "INSERT INTO kia (status, lat, long) VALUES (?, ?, ?)",
                                ['Draft', gps.latitude, gps.longitude]);
                    };

                    this.setDefaultValues = function (surveyId) {

                        var fields_with_default_values = [];

                        _.each(DBService.getKIAFields(), function (field) {
                            if (!(_.isUndefined(field.default_value)) || field.getDefaultValue) {
                                fields_with_default_values.push(field);
                            }
                        });

                        var updated_values = fields_with_default_values.map(function (field) {
                            var defaultValue = null;

                            if (field.getDefaultValue && typeof field.getDefaultValue === "function") {
                                defaultValue = field.getDefaultValue();
                            } else {
                                defaultValue = field.default_value;
                            }


                            if (field.data_type === 'number') {
                                var data = parseInt(defaultValue, 10);
                                if (data) {
                                    return field.field_name + "=" + data;
                                }
                            } else if (field.data_type === 'float') {
                                var data = parseFloat(defaultValue, 10);
                                if (data) {
                                    return field.field_name + "=" + data;
                                }
                            }
                            return field.field_name + "='" + defaultValue + "'";
                        });


                        var query = "UPDATE kia SET " + updated_values.join(",") +
                                " WHERE id=" + surveyId;
                        console.log(query);
                        return $cordovaSQLite.execute(DB, query, null);
                    };

                    this.getNextSection = function (current) {
                        return DBService.getNextSection(current);
                    };

                    this.getPreviousSection = function (current) {
                        return DBService.getPreviousSection(current);
                    };

                    this.update = function (section, survey) {
                        return CommonService.update(survey, section, "KIA");
                    };

                    this.getById = function (id) {
                        return $cordovaSQLite.execute(
                                DB, "SELECT * FROM kia WHERE id = ?", [id]);
                    };

                    this.deleteSurvey = function (id) {
                        return $cordovaSQLite.execute(
                                DB, "DELETE FROM kia WHERE id = ?", [id]);
                    };

                    this.getAll = function () {
                        return $cordovaSQLite.execute(DB, "SELECT * FROM kia");
                    };

                    this.getCompleted = function () {
                        return CommonService.getCompleted("KIA");
                    };

                    this.validate = function (section, survey) {
                        return CommonService.validate(section, survey, "KIA");
                    };


                }]);

})(window.angular);


