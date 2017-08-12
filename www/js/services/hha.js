(function (angular) {
    angular.module("app.services.hha", [])

            .service("HHAService", ["$cordovaSQLite", "DBService", "CommonService", "DEBUG",
                function ($cordovaSQLite, DBService, CommonService, DEBUG) {

                    this.createHHA = function (section) {
                        var columns = Object.keys(section);
                        var values = Object.values(section);
                        var placeholders = columns.map(function (column) {
                            return "?";
                        });
                        var query = "INSERT INTO hha (" + columns.join(",") + ") VALUES (" +
                                placeholders.join(",") + ")";
                        return $cordovaSQLite.execute(DB, query, values);
                    };

                    this.setDefaultValues = function (surveyId) {

                        var fields_with_default_values = [];

                        _.each(DBService.getHHAFields(), function (field) {
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


                        var query = "UPDATE hha SET " + updated_values.join(",") +
                                " WHERE id=" + surveyId;
                        console.log(query);
                        return $cordovaSQLite.execute(DB, query, null);
                    };

                    this.getAll = function () {
                        return $cordovaSQLite.execute(DB, "SELECT * FROM hha");
                    };

                    this.getCompleted = function () {

                        return CommonService.getCompleted("HHA");

                    };

                    this.update = function (sectionName, survey) {
                        return CommonService.update(survey, sectionName, "HHA");
                    };

                    this.getHHA = function (hha_id) {
                        return $cordovaSQLite.execute(DB, "SELECT * FROM hha WHERE id = ?", [hha_id]);
                    };

                    this.deleteSurvey = function (id) {
                        return $cordovaSQLite.execute(DB, "DELETE FROM hha WHERE id = ?", [id]);
                    };


                    this.animals = function () {
                        var animalsObj = ["Cattle", "Camels", "Goats", "Sheep", "Donkey", "Poultry"];
                        return animalsObj;
                    };

                    this.milk_animals = [
                      {
                        verbose_name: 'cows',
                        field_name: 'cows'
                      },
                      {
                        verbose_name: 'camels',
                        field_name: 'camels'
                      },
                      {
                        verbose_name: 'goats',
                        field_name: 'goats'
                      }
                    ];

                    this.cereals = function () {
                        var cerealsObj = [
                            {
                                verbose_name: "maize",
                                field_name: "maize"
                            },
                            {
                                verbose_name: "millet",
                                field_name: "millet"
                            },
                            {
                                verbose_name: "sorghum",
                                field_name: "sorghum"
                            },
                            {
                                verbose_name: "beans",
                                field_name: "beans"
                            },
                            {
                                verbose_name: "cow peas",
                                field_name: "cow_peas"
                            },
                            {
                                verbose_name: "pigeon peas",
                                field_name: "pigeon_peas"
                            },
                            {
                                verbose_name: "green grams",
                                field_name: "green_grams"
                            }];
                        return cerealsObj;
                    };

                    this.zero_to_seven = [0, 1, 2, 3, 4, 5, 6, 7];

                    this.food_sources = [
                        {
                            code: 1,
                            name: "Own Production"
                        },
                        {
                            code: 2,
                            name: "Casual Labour"
                        },
                        {
                            code: 3,
                            name: "Borrowed"
                        },
                        {
                            code: 4,
                            name: "Gift"
                        },
                        {
                            code: 5,
                            name: "Purchased"
                        },
                        {
                            code: 6,
                            name: "Food Aid"
                        },
                        {
                            code: 7,
                            name: "Barter"
                        },
                        {
                            code: 8,
                            name: "Credit/Loan"
                        },
                        {
                            code: 9,
                            name: "Hunting/Gathering/Fishing"
                        },
                        {
                            code: 10,
                            name: "Did not consume"
                        }
                    ];


                    this.getNextSection = function (current) {
                        var next_section = false;
                        _.each(DBService.getHHASections(), function (section) {
                            if (section.name === current) {
                                if (section.next) {
                                    next_section = section.next;
                                }
                            }
                        });
                        return next_section;
                    };

                    this.getPreviousSection = function (current) {
                        var previous_section = false;
                        _.each(DBService.getHHASections(), function (section) {
                            if (section.name === current) {
                                if (section.previous) {
                                    previous_section = section.previous;
                                }
                            }
                        });
                        return previous_section;
                    };

                    this.validate = function (section, survey) {
                        return CommonService.validate(section, survey, "HHA");
                    };

                }]);

})(window.angular);


