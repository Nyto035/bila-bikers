(function (angular) {
    angular.module("app.services.hsna", [])

            .service("HsnaService", ["$cordovaSQLite", "HSNADBService", "CommonService",
                function ($cordovaSQLite, DBService, CommonService) {

                    this.create = function (gps) {
                        return $cordovaSQLite.execute(DB,
                                "INSERT INTO hsna (status, lat, long) VALUES (?, ?, ?)",
                                ['Draft', gps.latitude, gps.longitude]);
                    };

                    this.setDefaultValues = function (surveyId) {

                        var fields_with_default_values = [];

                        _.each(DBService.getHSNAFields(), function (field) {
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


                        var query = "UPDATE hsna SET " + updated_values.join(",") +
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
                        return CommonService.update(survey, section, "HSNA");
                    };

                    this.getById = function (id) {
                        return $cordovaSQLite.execute(
                                DB, "SELECT * FROM hsna WHERE id = ?", [id]);
                    };

                    this.deleteSurvey = function (id) {
                        return $cordovaSQLite.execute(
                                DB, "DELETE FROM hsna WHERE id = ?", [id]);
                    };

                    this.getAll = function () {
                        return $cordovaSQLite.execute(DB, "SELECT * FROM hsna");
                    };

                    this.getCompleted = function () {
                        return CommonService.getCompleted("HSNA");
                    };

                    this.validate = function (section, survey) {
                        return CommonService.validate(section, survey, "HSNA");
                    };

                    this.infoSources = function() {
                        return [
                            { 'name': 'HSNP staff', 'value': 'hsnp_staff' },
                            { 'name': 'Chiefs/Assistant Chiefs', 'value': 'chiefs' },
                            { 'name': 'Elders', 'value': 'elders' },
                            { 'name': 'Heard on radio', 'value': 'radio' },
                            { 'name': 'Told by friends, family, neighbors', 'value': 'relatives' },
                            { 'name': 'Equity agent / duka owner', 'value': 'equity_agent' },
                            { 'name': 'Other - specify', 'value': 'other_sources' }
                        ];
                    };

                    this.foodItems = function() {
                        return [
                            { 'name': 'Maize / rice / posho', 'value': 'maize_rice_posho' },
                            { 'name': 'Pulses - beans/lentils etc', 'value': 'pulses' },
                            { 'name': 'Oil', 'value': 'oil' },
                            { 'name': 'Sugar', 'value': 'sugar' },
                            { 'name': 'Milk', 'value': 'milk' },
                            { 'name': 'Meat', 'value': 'meat' },
                            { 'name': 'Other food (specify)', 'value': 'other_foods' },
                        ];
                    };

                    this.nonFoodItems = function() {
                        return [
                            {
                                'name': 'Purchase of livestock, fodder, veterinary services, vet drugs',
                                'value': 'purchase_livestock',
                                'overlap': true,
                            },
                            {
                                'name': 'Purchase of water',
                                'value': 'purchase_water',
                            },
                            {
                                'name': 'Hiring of labor',
                                'value': 'hiring_labor',
                            },
                            {
                                'name': 'Purchase of medicine or medical assistance',
                                'value': 'purchase_medicine',
                                'overlap': true,
                            },
                            {
                                'name': 'School Fees and other school expenses',
                                'value': 'school_fees',
                                'overlap': true,
                            },
                            {
                                'name': 'Purchase of household items e.g clothing, soap, kerosene',
                                'value': 'purchase_of_household',
                                'overlap': true,
                            },
                            {
                                'name': 'Travel and related expenses',
                                'value': 'travel_expenses',
                                'overlap': true,
                            },
                            {
                                'name': 'Purchase of alcohol or entertainment',
                                'value': 'purchase_of_entertainment',
                                'overlap': true,
                            },
                            {
                                'name': 'Gifts or loans to other people (shared)',
                                'value': 'gifts',
                                'overlap': true,
                            },
                            {
                                'name': 'Loan/debt repayments',
                                'value': 'loans',
                            },
                            {
                                'name': 'Rental of housing / house repaiers and mentenance',
                                'value': 'rental',
                                'overlap': true,
                            },
                            {
                                'name': 'Other Items (specify)',
                                'value': 'other_items',
                            },
                            {
                                'name': 'anything but you can\'t remember',
                                'value': 'remember',
                            }
                        ];
                    };

                    this.assistanceReceived = function() {
                        return [
                            {
                                'name': 'Food aid to the household',
                                'value': 'food_aid',
                            },
                            {
                                'name': 'School feeding',
                                'value': 'school_feeding',
                            },
                            {
                                'name': 'Supplementary Feeding  (Children U&5 & Pregnant women)',
                                'value': 'supplementary_feeding',
                            },
                            {
                                'name': 'Kenya Livestock Insurance Program (KLP)',
                                'value': 'klp',
                            },
                            {
                                'name': 'Did expenditure in forage, fodder, veterinary services increase' +
                                    'because of KLP payment',
                                'value': 'increased_spending',
                            },
                            {
                                'name': 'Other cash payments from Non-Governmental sources NGOs, Red Cross etc',
                                'value': 'ngo_payments',
                            },
                            {
                                'name': 'Water tankering',
                                'value': 'water_tankering',
                            },
                            {
                                'name': 'Relief destocking',
                                'value': 'relief_destocking',
                            },
                            {
                                'name': 'Fodder Distribution',
                                'value': 'fodder_distribution',
                            },
                            {
                                'name': 'Livestock vaccination/healthcare',
                                'value': 'livestock_vaccination',
                            },
                            {
                                'name': 'Other (specify)',
                                'value': 'other_assistance',
                            },
                        ];
                    };

                }]);

})(window.angular);


