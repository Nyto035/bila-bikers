(function (angular) {
    angular.module("app.database", [])

            .service("DBService", ["$cordovaSQLite", "AuthService",
                function ($cordovaSQLite, AuthService) {

                    var greaterThanZero = function (value) {
                        if (value === null) {
                            return false;
                        }

                        if (isNaN(parseInt(value, 10))) {
                            return false;
                        }
                        if (parseInt(value, 10) <= 0) {
                            return false;
                        }

                        return true;
                    };

                    var isNull = function (value) {
                        if (value === "null") {
                            return true;
                        }
                        if (value === null) {
                            return true;
                        }
                        if (value.length < 1) {
                            return true;
                        }
                        return false;
                    };

                    var KIA = [
                        {
                            field_name: 'mode_of_collection',
                            required: false,
                            data_type: 'text',
                            section: 'All',
                            default_value: "Mobile App"
                        },
                        {
                            field_name: 'sync_failed_status_text',
                            required: false,
                            data_type: 'text',
                            section: 'All'
                        },
                        {
                            field_name: 'sync_failed_error_code',
                            required: false,
                            data_type: 'text',
                            section: 'All'
                        },
                        {
                            field_name: 'sync_failed_error_description',
                            required: false,
                            data_type: 'text',
                            section: 'All'
                        },
                        {
                            field_name: 'id',
                            required: true,
                            data_type: 'number',
                            section: 'All'
                        },
                        {
                            field_name: 'qid',
                            required: false,
                            data_type: 'number',
                            section: 'All'
                        },
                        {
                            field_name: 'status',
                            required: false,
                            data_type: 'text',
                            section: 'All'
                        },
                        {
                            field_name: 'month',
                            required: false,
                            data_type: 'number',
                            section: 'All',
                            getDefaultValue: function () {
                                return new Date().getMonth() + 1;
                            }
                        },
                        {
                            field_name: 'year',
                            required: false,
                            data_type: 'number',
                            section: 'All',
                            getDefaultValue: function () {
                                return new Date().getFullYear();
                            }
                        },
                        {
                            field_name: 'lat',
                            required: true,
                            data_type: 'float',
                            section: 'All'
                        },
                        {
                            field_name: 'long',
                            required: true,
                            data_type: 'float',
                            section: 'All'
                        },
                        {
                            field_name: 'county',
                            required: true,
                            data_type: 'text',
                            section: 'Background',
                            getDefaultValue: function () {
                                return AuthService.getUser().county;
                            }
                        },
                        {
                            field_name: 'sub_county',
                            verbose_name: 'Sub County',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'site',
                            verbose_name: 'Sentinel site',
                            required: true,
                            data_type: 'number',
                            section: 'Background'
                        },
                        {
                            field_name: 'community_name',
                            verbose_name: 'Community name',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'interview_date',
                            verbose_name: 'Interview date',
                            required: true,
                            data_type: 'date',
                            section: 'Background',
                            getDefaultValue: function () {
                                return new Date().toISOString();
                            }
                        },
                        {
                            field_name: 'rained_this_month',
                            required: true,
                            data_type: 'number',
                            section: 'Rainfall',
                            default_value: 0
                        },
                        {
                            field_name: 'rainfall_days',
                            required: false,
                            data_type: 'number',
                            section: 'Rainfall',
                            minimum_value: 1,
                            maximum_value: 28,
                            validate: function (survey, errors) {
                                if (survey.rained_this_month == 1 && !greaterThanZero(survey.rainfall_days)) {
                                    errors.push({
                                        field: 'rainfall_days',
                                        message: 'Days rained must be greater than 0 if it rained'
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'how_was_rainfall',
                            required: false,
                            data_type: 'text',
                            section: 'Rainfall',
                            validate: function (survey, errors) {
                                if (survey.rained_this_month == 1 && !greaterThanZero(survey.rainfall_days)) {
                                    errors.push({
                                        field: 'how_was_rainfall',
                                        message: 'Field is mandatory if it rained'
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'normal_for_the_month',
                            required: true,
                            data_type: 'number',
                            section: 'Rainfall',
                            default_value: 1
                        },
                        {
                            field_name: 'main_water_source1',
                            required: true,
                            data_type: 'text',
                            section: 'Water Resources',
                            default_value: 'Rivers'
                        },
                        {
                            field_name: 'main_water_source2',
                            required: false,
                            data_type: 'text',
                            section: 'Water Resources',
                            validate: function (survey, errors) {
                                if (survey.main_water_source1 === survey.main_water_source2) {
                                    errors.push({
                                        field: 'main_water_source2',
                                        message: "Main water source 1 and 2 cannot be the same. Leave water source 2 as N/A"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'main_water_source3',
                            required: false,
                            data_type: 'text',
                            section: 'Water Resources',
                            validate: function (survey, errors) {
                                if (survey.main_water_source1 === survey.main_water_source3) {
                                    errors.push({
                                        field: 'main_water_source3',
                                        message: "Main water source 3 cannot be the same as 1. Leave water source 3 as N/A"
                                    });
                                }
                                if (survey.main_water_source2 === survey.main_water_source3 && !isNull(survey.main_water_source3)) {
                                    errors.push({
                                        field: 'main_water_source3',
                                        message: "Main water source 3 cannot be the same as 2. Leave water source 3 as N/A"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'is_normal_main_source',
                            required: true,
                            data_type: 'number',
                            section: 'Water Resources',
                            default_value: 1
                        },
                        {
                            field_name: 'why_not_main_source',
                            required: false,
                            data_type: 'text',
                            section: 'Water Resources',
                            validate: function (survey, errors) {
                                if (survey.is_normal_main_source == 0 && isNull(survey.why_not_main_source)) {
                                    errors.push({
                                        field: 'why_not_main_source',
                                        message: 'Field is mandatory if water source is not main source'
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'distance_to_main_source',
                            verbose_name: 'Distance to main source of water',
                            required: true,
                            data_type: 'float',
                            section: 'Water Resources'
                        },
                        {
                            field_name: 'cattle_frequency',
                            required: false,
                            data_type: 'number',
                            section: 'Water Resources',
                            minimum_value: 0,
                            maximum_value: 7
                        },
                        {
                            field_name: 'camel_frequency',
                            required: false,
                            data_type: 'number',
                            section: 'Water Resources',
                            minimum_value: 0,
                            maximum_value: 7
                        },
                        {
                            field_name: 'goats_frequency',
                            required: false,
                            data_type: 'number',
                            section: 'Water Resources',
                            minimum_value: 0,
                            maximum_value: 7
                        },
                        {
                            field_name: 'sheep_frequency',
                            required: false,
                            data_type: 'number',
                            section: 'Water Resources',
                            minimum_value: 0,
                            maximum_value: 7
                        },
                        {
                            field_name: 'main_sources_lasting_period',
                            verbose_name: 'Main source lasting period',
                            required: true,
                            data_type: 'number',
                            section: 'Water Resources'
                        },
                        {
                            field_name: 'return_distance_to_water_source',
                            verbose_name: 'One way distance to main water source',
                            required: true,
                            data_type: 'float',
                            section: 'Water Resources'
                        },
                        {
                            field_name: 'grazing_area_distance',
                            required: false,
                            data_type: 'float',
                            section: 'Water Resources'
                        },
                        {
                            field_name: 'pasture_condition',
                            verbose_name: 'Pasture Condition',
                            required: true,
                            data_type: 'text',
                            section: 'Forage Condition'
                        },
                        {
                            field_name: 'pasture_condition_compared_to_similar_time',
                            required: false,
                            data_type: 'text',
                            section: 'Forage Condition'
                        },
                        {
                            field_name: 'pasture_lasting_period_in_months',
                            required: false,
                            data_type: 'number',
                            section: 'Forage Condition'
                        },
                        {
                            field_name: 'browse_condition',
                            verbose_name: 'Browse condition',
                            required: true,
                            data_type: 'text',
                            section: 'Forage Condition'
                        },
                        {
                            field_name: 'browse_condition_compared_to_similar_time',
                            required: false,
                            data_type: 'text',
                            section: 'Forage Condition'
                        },
                        {
                            field_name: 'browse_condition_lasting_period',
                            required: false,
                            data_type: 'number',
                            section: 'Forage Condition'
                        },
                        {
                            field_name: 'constraint_accessing_forage',
                            required: false,
                            data_type: 'number',
                            section: 'Forage Condition',
                            default_value: 0
                        },
                        {
                            field_name: 'main_constraint_accessing_forage',
                            required: false,
                            data_type: 'text',
                            section: 'Forage Condition',
                            validate: function (survey, errors) {
                                if (survey.constraint_accessing_forage == 1 && isNull(survey.main_constraint_accessing_forage)) {
                                    errors.push({
                                        field: 'main_constraint_accessing_forage',
                                        message: 'Field is mandatory if there was constraint accessing forage'
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'livestock_migration_presence',
                            required: true,
                            data_type: 'number',
                            section: 'Migration',
                            default_value: 3
                        },
                        {
                            field_name: 'migration_distance',
                            required: false,
                            data_type: 'number',
                            section: 'Migration'
                        },
                        {
                            field_name: 'cattle_migration_proportion',
                            required: false,
                            data_type: 'number',
                            section: 'Migration'
                        },
                        {
                            field_name: 'camel_migration_proportion',
                            required: false,
                            data_type: 'number',
                            section: 'Migration'
                        },
                        {
                            field_name: 'goats_migration_proportion',
                            required: false,
                            data_type: 'number',
                            section: 'Migration'
                        },
                        {
                            field_name: 'sheep_migration_proportion',
                            required: false,
                            data_type: 'number',
                            section: 'Migration'
                        },
                        {
                            field_name: 'donkeys_migration_proportion',
                            required: false,
                            data_type: 'number',
                            section: 'Migration'
                        },
                        {
                            field_name: 'migration_reason1',
                            required: false,
                            data_type: 'text',
                            section: 'Migration'
                        },
                        {
                            field_name: 'migration_reason2',
                            required: false,
                            data_type: 'text',
                            section: 'Migration',
                            validate: function (survey, errors) {
                                if (survey.migration_reason1 === survey.migration_reason2 && !isNull(survey.migration_reason1)) {
                                    errors.push({
                                        field: 'migration_reason2',
                                        message: "Migration reason 1 and 2 cannot be the same"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'migration_reason3',
                            required: false,
                            data_type: 'text',
                            section: 'Migration',
                            validate: function (survey, errors) {
                                if (survey.migration_reason1 === survey.migration_reason3 && !isNull(survey.migration_reason1)) {
                                    errors.push({
                                        field: 'migration_reason3',
                                        message: "Migration reason 1 and 3 cannot be the same"
                                    });
                                }
                                if (survey.migration_reason2 === survey.migration_reason3 && !isNull(survey.migration_reason3)) {
                                    errors.push({
                                        field: 'migration_reason3',
                                        message: "Migration reason 2 and 3 cannot be the same"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'is_migration_normal',
                            required: false,
                            data_type: 'number',
                            section: 'Migration',
                            default_value: 0
                        },
                        {
                            field_name: 'animals_expected_back_period_in_months',
                            required: false,
                            data_type: 'number',
                            section: 'Migration',
                            minimum_value: 0,
                            maximum_value: 1000,
                            validate: function (survey, errors) {
                                if (survey.is_migration_normal === 1 && !greaterThanZero(survey.animals_expected_back_period_in_months)) {
                                    errors.push({
                                        field: 'animals_expected_back_period_in_months',
                                        message: "Field is mandatory if migration is normal"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'livestock_market_name',
                            verbose_name: 'Market name',
                            required: true,
                            data_type: 'text',
                            section: 'Prices of Livestock'
                        },
                        {
                            field_name: 'is_market_normal_operation',
                            required: true,
                            data_type: 'number',
                            section: 'Prices of Livestock',
                            default_value: 1
                        },
                        {
                            field_name: 'market_abnormal_operation_reason',
                            required: false,
                            data_type: 'text',
                            section: 'Prices of Livestock',
                            validate: function (survey, errors) {
                                if (survey.is_market_normal_operation === 0 && isNull(survey.market_abnormal_operation_reason)) {
                                    errors.push({
                                        field: 'market_abnormal_operation_reason',
                                        message: "Field is mandatory if market has not been operating normally"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'livestock_readily_available_in_market',
                            required: false,
                            data_type: 'number',
                            section: 'Prices of Livestock',
                            default_value: 1
                        },
                        {
                            field_name: 'cattle_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Livestock',
                            maximum_value: 200000,
                            minimum_value: 500
                        },
                        {
                            field_name: 'goat_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Livestock',
                            maximum_value: 20000,
                            minimum_value: 100
                        },
                        {
                            field_name: 'sheep_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Livestock',
                            maximum_value: 20000,
                            minimum_value: 100
                        },
                        {
                            field_name: 'camel_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Livestock',
                            maximum_value: 100000,
                            minimum_value: 100
                        },
                        {
                            field_name: 'chicken_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Livestock',
                            maximum_value: 5000,
                            minimum_value: 50
                        },
                        {
                            field_name: 'commodity_market_name',
                            verbose_name: 'Market name',
                            required: true,
                            data_type: 'text',
                            section: 'Prices of Food Commodities'
                        },
                        {
                            field_name: 'is_commodity_market_normal_operation',
                            required: false,
                            data_type: 'number',
                            section: 'Prices of Food Commodities',
                            default_value: 1
                        },
                        {
                            field_name: 'commodity_market_main_reason',
                            required: false,
                            data_type: 'text',
                            section: 'Prices of Food Commodities',
                            validate: function (survey, errors) {
                                if (survey.is_commodity_market_normal_operation === 0 && isNull(survey.commodity_market_main_reason)) {
                                    errors.push({
                                        field: 'commodity_market_main_reason',
                                        message: "Field is mandatory if market has not been operating normally"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'cereals_readily_available',
                            required: true,
                            data_type: 'number',
                            section: 'Prices of Food Commodities',
                            default_value: 1
                        },
                        {
                            field_name: 'maize_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'posho_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'sifted_maize_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'millet_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'rice_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'sorghum_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'beans_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'green_grams_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'cow_peas_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'pigeon_peas_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'sugar_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'cooking_oil_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'milk_price',
                            required: false,
                            data_type: 'float',
                            section: 'Prices of Food Commodities',
                            minimum_value: 5,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'insecurity_incidents',
                            required: true,
                            data_type: 'number',
                            section: 'Human Diseases',
                            default_value: 0
                        },
                        {
                            field_name: 'epidemic_diseases_outbreak',
                            required: true,
                            data_type: 'number',
                            section: 'Human Diseases',
                            default_value: 0
                        },
                        {
                            field_name: 'major_disease_reported',
                            required: false,
                            data_type: 'text',
                            section: 'Human Diseases',
                            validate: function (survey, errors) {
                                if (survey.epidemic_diseases_outbreak == 1 && isNull(survey.major_disease_reported)) {
                                    errors.push({
                                        field: 'major_disease_reported',
                                        message: "Field is mandatory if there has been an epidemic outbreak"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'action_to_control_disease',
                            required: false,
                            data_type: 'text',
                            section: 'Human Diseases'
                        },
                        {
                            field_name: 'livestock_body_condition',
                            verbose_name: 'Livestock body condition',
                            required: true,
                            data_type: 'text',
                            section: 'Livestock Production'
                        },
                        {
                            field_name: 'is_livestock_body_condition_normal',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock Production',
                            default_value: 1
                        },
                        {
                            field_name: 'livestock_disease_outbreak',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock Production',
                            default_value: 0
                        },
                        {
                            field_name: 'livestock_major_diseases1',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock Production',
                            validate: function (survey, errors) {
                                if (survey.livestock_disease_outbreak === 1 && isNull(survey.livestock_major_diseases1)) {
                                    errors.push({
                                        field: 'livestock_major_diseases1',
                                        message: "Field is mandatory if there has been a disease outbreak"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'livestock_major_diseases2',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock Production',
                            validate: function (survey, errors) {
                                if (survey.livestock_major_diseases1 === survey.livestock_major_diseases2 && !isNull(survey.livestock_major_diseases1)) {
                                    errors.push({
                                        field: 'livestock_major_diseases2',
                                        message: "Major disease 1 and 2 cannot be the same"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'livestock_major_diseases3',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock Production',
                            validate: function (survey, errors) {
                                if (survey.livestock_major_diseases1 === survey.livestock_major_diseases3 && !isNull(survey.livestock_major_diseases1)) {
                                    errors.push({
                                        field: 'livestock_major_diseases3',
                                        message: "Major disease 1 and 3 cannot be the same"
                                    });
                                }
                                if (survey.livestock_major_diseases2 === survey.livestock_major_diseases3 && !isNull(survey.livestock_major_diseases3)) {
                                    errors.push({
                                        field: 'livestock_major_diseases3',
                                        message: "Major disease 2 and 3 cannot be the same"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'livestock_vaccinated_diseases',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock Production'
                        },
                        {
                            field_name: 'crops_grown_in_community',
                            required: true,
                            data_type: 'number',
                            section: 'Crop Production',
                            default_value: 0
                        },
                        {
                            field_name: 'main_food_crop_grown1',
                            required: false,
                            data_type: 'text',
                            section: 'Crop Production',
                            validate: function (survey, errors) {
                                if (survey.crops_grown_in_community == 1 && isNull(survey.main_food_crop_grown1)) {
                                    errors.push({
                                        field: 'main_food_crop_grown1',
                                        message: "Field is mandatory if there are crops grown"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'main_food_crop_grown2',
                            required: false,
                            data_type: 'text',
                            section: 'Crop Production',
                            validate: function (survey, errors) {
                                if (survey.main_food_crop_grown1 === survey.main_food_crop_grown2 && !isNull(survey.main_food_crop_grown1)) {
                                    errors.push({
                                        field: 'main_food_crop_grown2',
                                        message: "Food crop 1 and 2 cannot be the same"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'main_food_crop_grown3',
                            required: false,
                            data_type: 'text',
                            section: 'Crop Production',
                            validate: function (survey, errors) {
                                if (survey.main_food_crop_grown1 === survey.main_food_crop_grown3 && !isNull(survey.main_food_crop_grown1)) {
                                    errors.push({
                                        field: 'main_food_crop_grown3',
                                        message: "Food crop 1 and 3 cannot be the same"
                                    });
                                }
                                if (survey.main_food_crop_grown2 === survey.main_food_crop_grown3 && !isNull(survey.main_food_crop_grown3)) {
                                    errors.push({
                                        field: 'main_food_crop_grown3',
                                        message: "Food crop 2 and 3 cannot be the same"
                                    });
                                }
                            }
                        },
                        {
                            field_name: 'crops_current_development_stage',
                            required: false,
                            data_type: 'text',
                            section: 'Crop Production'
                        },
                        {
                            field_name: 'main_crops_current_condition',
                            required: false,
                            data_type: 'text',
                            section: 'Crop Production'
                        },
                        {
                            field_name: 'pests_affecting_crop',
                            required: false,
                            data_type: 'number',
                            section: 'Crop Production',
                            default_value: 0
                        }];

                    var KIA_SECTIONS = [
                        {
                            name: 'Background',
                            state_name: 'app.kia.kia_background',
                            next: 'app.kia.kia_rainfall',
                            previous: ''
                        },
                        {
                            name: 'Rainfall',
                            state_name: 'app.kia.kia_rainfall',
                            next: 'app.kia.kia_water_resources',
                            previous: 'app.kia.kia_background'
                        },
                        {
                            name: 'Water Resources',
                            state_name: 'app.kia.kia_water_resources',
                            next: 'app.kia.kia_forage_condition',
                            previous: 'app.kia.kia_rainfall'
                        },
                        {
                            name: 'Forage Condition',
                            state_name: 'app.kia.kia_forage_condition',
                            next: 'app.kia.kia_migration',
                            previous: 'app.kia.kia_water_resources'
                        },
                        {
                            name: 'Migration',
                            state_name: 'app.kia.kia_migration',
                            next: 'app.kia.kia_livestock_prices',
                            previous: 'app.kia.kia_forage_condition'
                        },
                        {
                            name: 'Prices of Livestock',
                            state_name: 'app.kia.kia_livestock_prices',
                            next: 'app.kia.kia_food_prices',
                            previous: 'app.kia.kia_migration'
                        },
                        {
                            name: 'Prices of Food Commodities',
                            state_name: 'app.kia.kia_food_prices',
                            next: 'app.kia.kia_human_diseases',
                            previous: 'app.kia.kia_livestock_prices'
                        },
                        {
                            name: 'Human Diseases',
                            state_name: 'app.kia.kia_human_diseases',
                            next: 'app.kia.kia_livestock_production',
                            previous: 'app.kia.kia_food_prices'
                        },
                        {
                            name: 'Livestock Production',
                            state_name: 'app.kia.kia_livestock_production',
                            next: 'app.kia.kia_rainfed_production',
                            previous: 'app.kia.kia_human_diseases'
                        },
                        {
                            name: 'Crop Production',
                            state_name: 'app.kia.kia_rainfed_production',
                            next: '',
                            previous: 'app.kia.kia_livestock_production'
                        }];

                    this.getHHASection = function () {
                        return HHA_SECTIONS;
                    };

                    this.getNextSection = function (current) {
                        var next_section = false;
                        _.each(KIA_SECTIONS, function (section) {
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
                        _.each(KIA_SECTIONS, function (section) {
                            if (section.name === current) {
                                if (section.previous) {
                                    previous_section = section.previous;
                                }
                            }
                        });
                        return previous_section;
                    };

                    this.getKIAFields = function () {
                        return KIA;
                    };





                    var OTHER_HHA_FIELDS = [
                        {
                            field_name: 'mode_of_collection',
                            required: false,
                            data_type: 'text',
                            section: 'All',
                            default_value: "Mobile App"
                        },
                        {
                            field_name: 'sync_failed_status_text',
                            required: false,
                            data_type: 'text',
                            section: 'All'
                        },
                        {
                            field_name: 'sync_failed_error_code',
                            required: false,
                            data_type: 'text',
                            section: 'All'
                        },
                        {
                            field_name: 'sync_failed_error_description',
                            required: false,
                            data_type: 'text',
                            section: 'All'
                        },
                        {
                            field_name: 'qid',
                            required: false,
                            data_type: 'number',
                            section: 'All'
                        },
                        {
                            field_name: 'status',
                            required: true,
                            data_type: 'text',
                            section: 'All',
                            default_value: "Draft"
                        },
                        {
                            field_name: 'county',
                            required: true,
                            data_type: 'text',
                            section: 'Background',
                            getDefaultValue: function () {
                                return AuthService.getUser().county;
                            }
                        },
                        {
                            field_name: 'sub_county',
                            verbose_name: 'Sub county',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'site',
                            verbose_name: 'Sentinel site / Ward',
                            required: true,
                            data_type: 'number',
                            section: 'Background'
                        },
                        {
                            field_name: 'livelihood_zone',
                            verbose_name: 'Livelihood zone',
                            required: true,
                            data_type: 'number',
                            section: 'Background'
                        },
                        {
                            field_name: 'household_code',
                            verbose_name: 'Household code',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'month',
                            required: false,
                            data_type: 'number',
                            section: 'All',
                            getDefaultValue: function () {
                                return new Date().getMonth() + 1;
                            }
                        },
                        {
                            field_name: 'year',
                            required: false,
                            data_type: 'number',
                            section: 'All',
                            getDefaultValue: function () {
                                return new Date().getFullYear();
                            }
                        },
                        {
                            field_name: 'interview_date',
                            verbose_name: 'Interview date',
                            required: true,
                            data_type: 'date',
                            section: 'Background',
                            getDefaultValue: function () {
                                return new Date().toISOString();
                            }
                        },
                        {
                            field_name: 'household_name',
                            verbose_name: 'Household head name',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'head_gender',
                            verbose_name: 'Household head gender',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'head_education_level',
                            verbose_name: 'Household head level of education',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'household_main_income_source',
                            verbose_name: 'Household main source of income',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'respondent_name',
                            verbose_name: 'Respondent name',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'respondent_gender',
                            verbose_name: 'Respondent gender',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'male_members',
                            verbose_name: 'No. of male members',
                            required: true,
                            data_type: 'number',
                            section: 'Background',
                            minimum_value: 0,
                            maximum_value: 100
                        },
                        {
                            field_name: 'female_members',
                            verbose_name: 'No. of female members',
                            required: true,
                            data_type: 'number',
                            section: 'Background',
                            minimum_value: 0,
                            maximum_value: 100
                        },
                        {
                            field_name: 'children_below5',
                            verbose_name: 'No. of children below five',
                            required: true,
                            data_type: 'number',
                            section: 'Background',
                            minimum_value: 0,
                            maximum_value: 100
                        },
                        {
                            field_name: 'keep_livestock',
                            verbose_name: 'Does the household keep livestock',
                            required: true,
                            data_type: 'number',
                            section: 'Livestock',
                            default_value: 0
                        },
                        {
                            field_name: 'KeepCattle',
                            verbose_name: 'Does the household keep cows',
                            required: false,
                            data_type: 'boolean',
                            section: 'Livestock',
                            default_value: false
                        },
                        {
                            field_name: 'KeepCamels',
                            verbose_name: 'Does the household keep camels',
                            required: false,
                            data_type: 'boolean',
                            section: 'Livestock',
                            default_value: false
                        },
                        {
                            field_name: 'KeepGoats',
                            verbose_name: 'Does the household keep goats',
                            required: false,
                            data_type: 'boolean',
                            section: 'Livestock',
                            default_value: false
                        },
                        {
                            field_name: 'KeepSheep',
                            verbose_name: 'Does the household keep sheep',
                            required: false,
                            data_type: 'boolean',
                            section: 'Livestock',
                            default_value: false
                        },
                        {
                            field_name: 'KeepDonkey',
                            verbose_name: 'Does the household keep donkeys',
                            required: false,
                            data_type: 'boolean',
                            section: 'Livestock',
                            default_value: false
                        },
                        {
                            field_name: 'KeepPoultry',
                            verbose_name: 'Does the household keep poultry',
                            required: false,
                            data_type: 'boolean',
                            section: 'Livestock',
                            default_value: false
                        },
                        {
                            field_name: 'CattleKept',
                            verbose_name: 'No. of cows kept today',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CamelsKept',
                            verbose_name: 'No. of camels kept today',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'GoatsKept',
                            verbose_name: 'No. of goats kept today',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'SheepKept',
                            verbose_name: 'No. of sheep kept today',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'DonkeyKept',
                            verbose_name: 'No. of donkeys kept today',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'PoultryKept',
                            verbose_name: 'No. of poultry kept today',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CattleBorn',
                            verbose_name: 'No. of cows born in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CamelsBorn',
                            verbose_name: 'No. of camels born in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'GoatsBorn',
                            verbose_name: 'No. of goats born in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'SheepBorn',
                            verbose_name: 'No. of sheep born in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'DonkeyBorn',
                            verbose_name: 'No. of donkeys born in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'PoultryBorn',
                            verbose_name: 'No. of poultry born in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CattlePurchased',
                            verbose_name: 'No. of cows purchased in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CamelsPurchased',
                            verbose_name: 'No. of camels purchased in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'GoatsPurchased',
                            verbose_name: 'No. of goats purchased in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'SheepPurchased',
                            verbose_name: 'No. of sheep purchased in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'DonkeyPurchased',
                            verbose_name: 'No. of donkeys purchased in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'PoultryPurchased',
                            verbose_name: 'No. of poultry purchased in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CattleSold',
                            verbose_name: 'No. of cows sold in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CamelsSold',
                            verbose_name: 'No. of camels sold in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'GoatsSold',
                            verbose_name: 'No. of goats sold in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'SheepSold',
                            verbose_name: 'No. of sheep sold in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'DonkeySold',
                            verbose_name: 'No. of donkeys sold in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'PoultrySold',
                            verbose_name: 'No. of poultry sold in the last 4 weeks',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CattlePrice',
                            verbose_name: 'Average price of cows',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CamelsPrice',
                            verbose_name: 'Average price of camels',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'GoatsPrice',
                            verbose_name: 'Average price of goats',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'SheepPrice',
                            verbose_name: 'Average price of sheep',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'DonkeyPrice',
                            verbose_name: 'Average price of donkeys',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'PoultryPrice',
                            verbose_name: 'Average price of poulty',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CattlePos',
                            verbose_name: 'Cows point of sale',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'CamelsPos',
                            verbose_name: 'Camels point of sale',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'GoatsPos',
                            verbose_name: 'Goats point of sale',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'SheepPos',
                            verbose_name: 'Sheep  point of sale',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'DonkeyPos',
                            verbose_name: 'Donkeys point of sale',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'PoultryPos',
                            verbose_name: 'Poulty point of sale',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'CattleDied',
                            verbose_name: 'No. of cows died',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CamelsDied',
                            verbose_name: 'No. of camels died',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'GoatsDied',
                            verbose_name: 'No. of goats died',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'SheepDied',
                            verbose_name: 'No. of sheep died',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'DonkeyDied',
                            verbose_name: 'No. of donkeys died',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'PoultryDied',
                            verbose_name: 'No. of poulty died',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'CattleDeathReason',
                            verbose_name: 'Reason for death of cows',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'CamelsDeathReason',
                            verbose_name: 'Reason for death of camels',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'GoatsDeathReason',
                            verbose_name: 'Reason for death of goats',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'SheepDeathReason',
                            verbose_name: 'Reason for death of sheep',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'DonkeyDeathReason',
                            verbose_name: 'Reason for death of donkeys',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'PoultryDeathReason',
                            verbose_name: 'Reason for death of poultry',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'CattleOtherReason',
                            verbose_name: 'Other reason for death of cows',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'CamelsOtherReason',
                            verbose_name: 'Other reason for death of camels',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'GoatsOtherReason',
                            verbose_name: 'Other reason for death of goats',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'SheepOtherReason',
                            verbose_name: 'Other reason for death of sheep',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'DonkeyOtherReason',
                            verbose_name: 'Other reason for death of donkeys',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'PoultryOtherReason',
                            verbose_name: 'Other reason for death of poultry',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'who_drank_milk',
                            verbose_name: 'Who drank milk in the household',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'milk_source',
                            verbose_name: 'Source of milk',
                            required: false,
                            data_type: 'text',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'harvested_in_last_weeks',
                            verbose_name: 'Does the household grow food crops',
                            required: true,
                            data_type: 'number',
                            section: 'Crop Production',
                            default_value: 0
                        },
                        {
                            field_name: 'grow_maize',
                            verbose_name: 'Does the household grow maize',
                            required: false,
                            data_type: 'boolean',
                            section: 'Crop Production',
                            default_value: false
                        },
                        {
                            field_name: 'grow_millet',
                            verbose_name: 'Does the household grow millet',
                            required: false,
                            data_type: 'boolean',
                            section: 'Crop Production',
                            default_value: false
                        },
                        {
                            field_name: 'grow_sorghum',
                            verbose_name: 'Does the household grow sorghum',
                            required: false,
                            data_type: 'boolean',
                            section: 'Crop Production',
                            default_value: false
                        },
                        {
                            field_name: 'grow_beans',
                            verbose_name: 'Does the household grow beans',
                            required: false,
                            data_type: 'boolean',
                            section: 'Crop Production',
                            default_value: false
                        },
                        {
                            field_name: 'grow_cow_peas',
                            verbose_name: 'Does the household grow cow peas',
                            required: false,
                            data_type: 'boolean',
                            section: 'Crop Production',
                            default_value: false
                        },
                        {
                            field_name: 'grow_pigeon_peas',
                            verbose_name: 'Does the household grow pigeon peas',
                            required: false,
                            data_type: 'boolean',
                            section: 'Crop Production',
                            default_value: false
                        },
                        {
                            field_name: 'grow_green_grams',
                            verbose_name: 'Does the household grow green grams',
                            required: false,
                            data_type: 'boolean',
                            section: 'Crop Production',
                            default_value: false
                        },
                        {
                            field_name: 'maize_area_planted',
                            verbose_name: 'Maize area planted',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'millet_area_planted',
                            verbose_name: 'Millet area planted',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'sorghum_area_planted',
                            verbose_name: 'Sorghum area planted',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'beans_area_planted',
                            verbose_name: 'Beans area planted',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'cow_peas_area_planted',
                            verbose_name: 'Cow peas area planted',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'pigeon_peas_area_planted',
                            verbose_name: 'Pigeon peas area planted',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'green_grams_area_planted',
                            verbose_name: 'Green grams area planted',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'maize_area_harvested',
                            verbose_name: 'Maize area harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'millet_area_harvested',
                            verbose_name: 'Millet area harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'sorghum_area_harvested',
                            verbose_name: 'Sorghum area harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'beans_area_harvested',
                            verbose_name: 'Beans area harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'cow_peas_area_harvested',
                            verbose_name: 'Cow peas area harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'pigeon_peas_area_harvested',
                            verbose_name: 'Pigeon peas area harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'green_grams_area_harvested',
                            verbose_name: 'Green grams area harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'maize_bags_harvested',
                            verbose_name: 'Maize bags harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'millet_bags_harvested',
                            verbose_name: 'Millet bags harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'sorghum_bags_harvested',
                            verbose_name: 'Sorghum bags harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'beans_bags_harvested',
                            verbose_name: 'Beans bags harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'cow_peas_bags_harvested',
                            verbose_name: 'Cow peas bags harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'pigeon_peas_bags_harvested',
                            verbose_name: 'Pigeon peas bags harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'green_grams_bags_harvested',
                            verbose_name: 'Green grams bags harvested',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'maize_bags_harvested_previous',
                            verbose_name: 'Maize bags from previous season',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'millet_bags_harvested_previous',
                            verbose_name: 'Millet bags from previous season',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'sorghum_bags_harvested_previous',
                            verbose_name: 'Sorghum bags from previous season',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'beans_bags_harvested_previous',
                            verbose_name: 'Beans bags from previous season',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'cow_peas_bags_harvested_previous',
                            verbose_name: 'Cow peas bags from previous season',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'pigeon_peas_bags_harvested_previous',
                            verbose_name: 'Pigeon peas bags from previous season',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'green_grams_bags_harvested_previous',
                            verbose_name: 'Green grams bags from previous season',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'maize_bags_sold',
                            verbose_name: 'Maize bags sold',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'millet_bags_sold',
                            verbose_name: 'Millet bags sold',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'sorghum_bags_sold',
                            verbose_name: 'Sorghum bags sold',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'beans_bags_sold',
                            verbose_name: 'Beans bags sold',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'cow_peas_bags_sold',
                            verbose_name: 'Cow peas bags sold',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'pigeon_peas_bags_sold',
                            verbose_name: 'Pigeon peas bags sold',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'green_grams_bags_sold',
                            verbose_name: 'Green grams bags sold',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 100000
                        },
                        {
                            field_name: 'maize_avg_kg_price',
                            verbose_name: 'Maize average price per kg',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 10000
                        },
                        {
                            field_name: 'millet_avg_kg_price',
                            verbose_name: 'Millet average price per kg',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'sorghum_avg_kg_price',
                            verbose_name: 'Sorghum average price per kg',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 10000
                        },
                        {
                            field_name: 'beans_avg_kg_price',
                            verbose_name: 'Beans average price per kg',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 10000
                        },
                        {
                            field_name: 'cow_peas_avg_kg_price',
                            verbose_name: 'Cow peas average price per kg',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 10000
                        },
                        {
                            field_name: 'pigeon_peas_avg_kg_price',
                            verbose_name: 'Pigeon peas average price per kg',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 10000
                        },
                        {
                            field_name: 'green_grams_avg_kg_price',
                            verbose_name: 'Green grams average price per kg',
                            required: false,
                            data_type: 'float',
                            section: 'Crop Production',
                            minimum_value: 0,
                            maximum_value: 10000
                        },
                        {
                            field_name: 'have_food_stock',
                            verbose_name: 'Do you have food stocks',
                            required: true,
                            data_type: 'number',
                            section: 'Stocks',
                            default_value: 0
                        },
                        {
                            field_name: 'food_stock_sources',
                            verbose_name: 'Food stock sources',
                            required: false,
                            data_type: 'text',
                            section: 'Stocks'
                        },
                        {
                            field_name: 'days_stock_last',
                            verbose_name: 'Food stock lasting days',
                            required: false,
                            data_type: 'number',
                            section: 'Stocks'
                        },
                        {
                            field_name: 'main_income_source',
                            verbose_name: 'Main source of income',
                            required: true,
                            data_type: 'text',
                            section: 'Income Sources'
                        },
                        {
                            field_name: 'male_casual_labour',
                            verbose_name: 'Male members casual labour',
                            required: false,
                            data_type: 'number',
                            section: 'Income Sources',
                            minimum_value: 0,
                            maximum_value: 100
                        },
                        {
                            field_name: 'female_casual_labour',
                            verbose_name: 'Female members casual labour',
                            required: false,
                            data_type: 'number',
                            section: 'Income Sources',
                            minimum_value: 0,
                            maximum_value: 100
                        },
                        {
                            field_name: 'casual_labour_earn',
                            verbose_name: 'Earnings from casual labour',
                            required: false,
                            data_type: 'float',
                            section: 'Income Sources',
                            minimum_value: 0,
                            maximum_value: 10000000
                        },
                        {
                            field_name: 'charcoal_sale_earn',
                            verbose_name: 'Earnings from sale of charcoal',
                            required: false,
                            data_type: 'float',
                            section: 'Income Sources',
                            minimum_value: 0,
                            maximum_value: 10000000
                        },
                        {
                            field_name: 'wood_sale_earn',
                            verbose_name: 'Earnings from sale of wood',
                            required: false,
                            data_type: 'float',
                            section: 'Income Sources',
                            minimum_value: 0,
                            maximum_value: 10000000
                        },
                        {
                            field_name: 'water_source1',
                            verbose_name: 'Water source 1',
                            required: true,
                            data_type: 'text',
                            section: 'Water Resources'
                        },
                        {
                            field_name: 'water_source2',
                            verbose_name: 'Water source 2',
                            required: false,
                            data_type: 'text',
                            section: 'Water Resources'
                        },
                        {
                            field_name: 'water_source3',
                            verbose_name: 'Water source 3',
                            required: false,
                            data_type: 'text',
                            section: 'Water Resources'
                        },
                        {
                            field_name: 'normal_water_source',
                            verbose_name: 'Is / are normal water source(s)',
                            required: true,
                            data_type: 'number',
                            section: 'Water Resources',
                            default_value: 1
                        },
                        {
                            field_name: 'why_not_normal_water_source',
                            verbose_name: 'Why not normal source(s)',
                            required: false,
                            data_type: 'text',
                            section: 'Water Resources'
                        },
                        {
                            field_name: 'days_water_source_expected_to_last',
                            verbose_name: 'Days water source(s) expected to last',
                            required: false,
                            data_type: 'number',
                            section: 'Water Resources',
                            minimum_value: 0,
                            maximum_value: 10000
                        },
                        {
                            field_name: 'distance_from_water_source',
                            verbose_name: 'Return distance from water source',
                            required: false,
                            data_type: 'float',
                            section: 'Water Resources',
                            minimum_value: 0,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'no_water_jerrycans',
                            verbose_name: 'No. of water jerry cans',
                            required: false,
                            data_type: 'float',
                            section: 'Water Resources',
                            minimum_value: 0,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'hh_pay_for_water',
                            verbose_name: 'Does household pay for water',
                            required: true,
                            data_type: 'number',
                            section: 'Water Resources',
                            default_value: 0
                        },
                        {
                            field_name: 'jerrycans_cost',
                            verbose_name: 'Cost of a jerry can of water',
                            required: false,
                            data_type: 'float',
                            section: 'Water Resources',
                            minimum_value: 0,
                            maximum_value: 1000
                        },
                        {
                            field_name: 'normal_hh_water_consumption',
                            verbose_name: 'Average household water consumption',
                            required: false,
                            data_type: 'number',
                            section: 'Water Resources',
                            minimum_value: 0,
                            maximum_value: 10000
                        },
                        {
                            field_name: 'cost_transport_jerrycan',
                            verbose_name: 'Cost of transporting a jerry can',
                            required: false,
                            data_type: 'float',
                            section: 'Water Resources',
                            minimum_value: 0,
                            maximum_value: 10000
                        },
                        {
                            field_name: 'treat_water_before_drinking',
                            verbose_name: 'Water treated before drinking',
                            required: true,
                            data_type: 'boolean',
                            section: 'Water Resources',
                            default_value: 0
                        },
                        {
                            field_name: 'water_treatment_method_used',
                            verbose_name: 'Water treatment method',
                            required: false,
                            data_type: 'text',
                            section: 'Water Resources'
                        },
                        {
                            field_name: 'csi_relied_on_less',
                            verbose_name: 'Relied on less preferred and/or less expensive food',
                            required: true,
                            data_type: 'number',
                            section: 'Coping Strategies',
                            minimum_value: 0,
                            maximum_value: 7
                        },
                        {
                            field_name: 'csi_borrowed_food',
                            verbose_name: 'Borrowed food, or relied on help from friends or relatives',
                            required: true,
                            data_type: 'number',
                            section: 'Coping Strategies',
                            minimum_value: 0,
                            maximum_value: 7
                        },
                        {
                            field_name: 'csi_reduced_no_of_meals',
                            verbose_name: 'Reduced the number of meals eaten per day',
                            required: true,
                            data_type: 'number',
                            section: 'Coping Strategies',
                            minimum_value: 0,
                            maximum_value: 7
                        },
                        {
                            field_name: 'csi_reduced_portion_meal_size',
                            verbose_name: 'Reduced the portion size of meals',
                            required: true,
                            data_type: 'number',
                            section: 'Coping Strategies',
                            minimum_value: 0,
                            maximum_value: 7
                        },
                        {
                            field_name: 'csi_quantity_for_adult',
                            verbose_name: 'Reduced the quantity of food consumed by adults/mothers',
                            required: true,
                            data_type: 'number',
                            section: 'Coping Strategies',
                            minimum_value: 0,
                            maximum_value: 7
                        },
                        {
                            field_name: 'csi_sold_household_assets',
                            verbose_name: 'Sold household assets/goods',
                            required: true,
                            data_type: 'number',
                            section: 'Livelihood Coping'
                        },
                        {
                            field_name: 'csi_reduced_nonfood_expenses',
                            verbose_name: 'Reduced non food expenses on health and education',
                            required: true,
                            data_type: 'number',
                            section: 'Livelihood Coping'
                        },
                        {
                            field_name: 'csi_sold_productive_assets',
                            verbose_name: 'Sold productive assets or means of transport',
                            required: true,
                            data_type: 'number',
                            section: 'Livelihood Coping'
                        },
                        {
                            field_name: 'csi_spent_savings',
                            verbose_name: 'Spent savings',
                            required: true,
                            data_type: 'number',
                            section: 'Livelihood Coping'
                        },
                        {
                            field_name: 'csi_borrowed_money',
                            verbose_name: 'Borrowed money / food from a lender / bank',
                            required: true,
                            data_type: 'number',
                            section: 'Livelihood Coping'
                        },
                        {
                            field_name: 'csi_sold_house_land',
                            verbose_name: 'Sold house or land',
                            required: true,
                            data_type: 'number',
                            section: 'Livelihood Coping'
                        },
                        {
                            field_name: 'csi_withdrew_children_school',
                            verbose_name: 'Withdrew children from school',
                            required: true,
                            data_type: 'number',
                            section: 'Livelihood Coping'
                        },
                        {
                            field_name: 'csi_sold_last_female_animal',
                            verbose_name: 'Sold last female animals',
                            required: true,
                            data_type: 'number',
                            section: 'Livelihood Coping'
                        },
                        {
                            field_name: 'csi_begging',
                            verbose_name: 'Begging',
                            required: true,
                            data_type: 'number',
                            section: 'Livelihood Coping'
                        },
                        {
                            field_name: 'csi_sold_more_animals',
                            verbose_name: 'Sold more animals (non-productive) than usual',
                            required: true,
                            data_type: 'number',
                            section: 'Livelihood Coping'
                        },
                        {
                            field_name: 'hfc_grain_days',
                            verbose_name: 'Grain days',
                            required: true,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_grain_source',
                            verbose_name: 'Grain sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_roots_days',
                            verbose_name: 'Root days',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_roots_source',
                            verbose_name: 'Root sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_pulses_nuts_days',
                            verbose_name: 'Pulses / nuts days',
                            required: true,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_pulses_nuts_source',
                            verbose_name: 'Pulses / nuts sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_orange_veg_days',
                            verbose_name: 'Vegetable days',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_orange_veg_source',
                            verbose_name: 'Vegetable sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_green_leafy_days',
                            verbose_name: 'Green leafy days',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_green_leafy_source',
                            verbose_name: 'Green leafy sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_other_veg_days',
                            verbose_name: 'Other vegetable days',
                            required: true,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_other_veg_source',
                            verbose_name: 'Other vegetable sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_orange_fruits_days',
                            verbose_name: 'Orange fruits days',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_orange_fruits_source',
                            verbose_name: 'Orange fruits sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_other_fruits_days',
                            verbose_name: 'Other fruits days',
                            required: true,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_other_fruits_source',
                            verbose_name: 'Other fruits sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_meat_days',
                            verbose_name: 'Meat days',
                            required: true,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_meat_source',
                            verbose_name: 'Meat sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_liver_days',
                            verbose_name: 'Liver days',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_liver_source',
                            verbose_name: 'Liver sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_fish_days',
                            verbose_name: 'Fish days',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_fish_source',
                            verbose_name: 'Fish sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_eggs_days',
                            verbose_name: 'Eggs days',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_eggs_source',
                            verbose_name: 'Eggs sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_milk_days',
                            verbose_name: 'Milk days',
                            required: true,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_milk_source',
                            verbose_name: 'Milk sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_oil_days',
                            verbose_name: 'Oil days',
                            required: true,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_oil_source',
                            verbose_name: 'Oil sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_sugar_days',
                            verbose_name: 'Sugar days',
                            required: true,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_sugar_source',
                            verbose_name: 'Sugar sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_condiments_days',
                            verbose_name: 'Condiments days',
                            required: true,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'hfc_condiments_source',
                            verbose_name: 'Condiments sources',
                            required: false,
                            data_type: 'number',
                            section: 'Nutrition'
                        },
                        {
                            field_name: 'child_1_name',
                            verbose_name: 'Name of child 1',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_1_gender',
                            verbose_name: 'Gender of child 1',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_1_age',
                            verbose_name: 'Age of child 1',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_1_lives_in_household',
                            verbose_name: 'Does child 1 live in household',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition',
                            default_value: 1
                        },
                        {
                            field_name: 'child_1_muac',
                            verbose_name: 'Child 1 MUAC',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_1_illness',
                            verbose_name: 'Child 1 suffered from illness',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_2_name',
                            verbose_name: 'Name of child 2',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_2_gender',
                            verbose_name: 'Gender of child 2',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_2_age',
                            verbose_name: 'Age of child 2',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_2_lives_in_household',
                            verbose_name: 'Does child 2 live in household',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition',
                            default_value: 0
                        },
                        {
                            field_name: 'child_2_muac',
                            verbose_name: 'Child 2 MUAC',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_2_illness',
                            verbose_name: 'Child 2 suffered from illness',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_3_name',
                            verbose_name: 'Name of child 3',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_3_gender',
                            verbose_name: 'Gender of child 3',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_3_age',
                            verbose_name: 'Age of child 3',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_3_lives_in_household',
                            verbose_name: 'Does child 3 live in household',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition',
                            default_value: 0
                        },
                        {
                            field_name: 'child_3_muac',
                            verbose_name: 'Child 3 MUAC',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_3_illness',
                            verbose_name: 'Child 3 suffered from illness',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_4_name',
                            verbose_name: 'Name of child 4',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_4_gender',
                            verbose_name: 'Gender of child 4',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_4_age',
                            verbose_name: 'Age of child 4',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_4_lives_in_household',
                            verbose_name: 'Does child 4 live in household',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition',
                            default_value: 0
                        },
                        {
                            field_name: 'child_4_muac',
                            verbose_name: 'Child 4 MUAC',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_4_illness',
                            verbose_name: 'Child 4 suffered from illness',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_5_name',
                            verbose_name: 'Name of child 5',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_5_gender',
                            verbose_name: 'Gender of child 5',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_5_age',
                            verbose_name: 'Age of child 5',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_5_lives_in_household',
                            verbose_name: 'Does child 5 live in household',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition',
                            default_value: 0
                        },
                        {
                            field_name: 'child_5_muac',
                            verbose_name: 'Child 5 MUAC',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_5_illness',
                            verbose_name: 'Child 5 suffered from illness',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_6_name',
                            verbose_name: 'Name of child 6',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_6_gender',
                            verbose_name: 'Gender of child 6',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_6_age',
                            verbose_name: 'Age of child 6',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_6_lives_in_household',
                            verbose_name: 'Does child 6 live in household',
                            required: false,
                            data_type: 'number',
                            section: 'Children Nutrition',
                            default_value: 0
                        },
                        {
                            field_name: 'child_6_muac',
                            verbose_name: 'Child 6 MUAC',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'child_6_illness',
                            verbose_name: 'Child 6 suffered from illness',
                            required: false,
                            data_type: 'text',
                            section: 'Children Nutrition'
                        },
                        {
                            field_name: 'lat',
                            required: false,
                            data_type: 'float',
                            section: 'None'
                        },
                        {
                            field_name: 'long',
                            required: false,
                            data_type: 'float',
                            section: 'None'
                        },
                        {
                            field_name: 'harvested_in_last_weeks',
                            verbose_name: 'HHA HACKING FIELDS',
                            required: true,
                            data_type: 'boolean',
                            section: 'Crop Production',
                            default_value: true
                        },
                        {
                            field_name: 'milked_animals',
                            verbose_name: 'Did the household milk any animals in the last 4 weeks?',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            default_value: 0
                        },
                        {
                            field_name: 'milked_cows',
                            verbose_name: 'Did the household milk cows?',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            default_value: 0
                        },
                        {
                            field_name: 'milked_camels',
                            verbose_name: 'Did the household milk camels?',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            default_value: 0
                        },
                        {
                            field_name: 'milked_goats',
                            verbose_name: 'Did the household milk goats?',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock',
                            default_value: 0
                        },
                        {
                            field_name: 'cows_amount_milked',
                            verbose_name: 'Amount milked',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'camels_amount_milked',
                            verbose_name: 'Amount milked',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'goats_amount_milked',
                            verbose_name: 'Amount milked',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'cows_amount_consumed',
                            verbose_name: 'Amount consumed',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'camels_amount_consumed',
                            verbose_name: 'Amount consumed',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'goats_amount_consumed',
                            verbose_name: 'Amount consumed',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'cows_amount_sold',
                            verbose_name: 'Amount sold',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'camels_amount_sold',
                            verbose_name: 'Amount sold',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'goats_amount_sold',
                            verbose_name: 'Amount sold',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'cows_milk_price',
                            verbose_name: 'Average price',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'camels_milk_price',
                            verbose_name: 'Average price',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        },
                        {
                            field_name: 'goats_milk_price',
                            verbose_name: 'Average price',
                            required: false,
                            data_type: 'number',
                            section: 'Livestock'
                        }
                    ];


                    var HHA_SECTIONS = [
                        {
                            name: 'Background',
                            state_name: 'app.hha.new_hha',
                            next: 'app.hha.hha_livestock',
                            previous: ''
                        },
                        {
                            name: 'Livestock',
                            state_name: 'app.hha.hha_livestock',
                            next: 'app.hha.hha_crop_production',
                            previous: 'app.hha.new_hha'
                        },
                        {
                            name: 'Crop Production',
                            state_name: 'app.hha.hha_crop_production',
                            next: 'app.hha.hha_stocks',
                            previous: 'app.hha.hha_livestock'
                        },
                        {
                            name: 'Stocks',
                            state_name: 'app.hha.hha_stocks',
                            next: 'app.hha.hha_income_sources',
                            previous: 'app.hha.hha_crop_production'
                        },
                        {
                            name: 'Income Sources',
                            state_name: 'app.hha.hha_income_sources',
                            next: 'app.hha.hha_water_resources',
                            previous: 'app.hha.hha_stocks'
                        },
                        {
                            name: 'Water Resources',
                            state_name: 'app.hha.hha_water_resources',
                            next: 'app.hha.hha_coping_strategies',
                            previous: 'app.hha.hha_income_sources'
                        },
                        {
                            name: 'Coping Strategies',
                            state_name: 'app.hha.hha_coping_strategies',
                            next: 'app.hha.hha_livelihood_coping',
                            previous: 'app.hha.hha_water_resources'
                        },
                        {
                            name: 'Livelihood Coping',
                            state_name: 'app.hha.hha_livelihood_coping',
                            next: 'app.hha.hha_nutrition',
                            previous: 'app.hha.hha_coping_strategies'
                        },
                        {
                            name: 'Nutrition',
                            state_name: 'app.hha.hha_nutrition',
                            next: 'app.hha.hha_nutrition_status',
                            previous: 'app.hha.hha_livelihood_coping'
                        },
                        {
                            name: 'Children Nutrition',
                            state_name: 'app.hha.hha_nutrition_status',
                            next: '',
                            previous: 'app.hha.hha_nutrition'
                        }
                    ];

                    this.getHHAFields = function () {
                        return OTHER_HHA_FIELDS;
                    };
                    this.getHHASections = function () {
                        return HHA_SECTIONS;
                    };

                    this.initialize = function () {
                        // $cordovaSQLite.execute(DB, "DROP TABLE IF EXISTS users");
                        var user_query = "CREATE TABLE IF NOT EXISTS users (id text, first_name text, last_name text, email text, password text,"+
                            "phone_number text, token text, is_courier integer DEFAULT 0, logged_in integer DEFAULT 0)";
                        $cordovaSQLite.execute(DB, user_query);

                        $cordovaSQLite.execute(DB, "CREATE TABLE IF NOT EXISTS options (id integer, livelihood_zone_id integer, household_name text, integration_id integer, wording text not null, parent text, group_name text,  parent_group text)");

//                        $cordovaSQLite.execute(DB, "DROP TABLE IF EXISTS options");

                        var query = "CREATE TABLE IF NOT EXISTS kia (id integer primary key)";

                        $cordovaSQLite.execute(DB, query).then(function () {

                        }, function (error) {
                            alert(error);
                        });

                        for (var index = 0; index < KIA.length; index++) {
                            var columnName = KIA[index].field_name;
                            var field = KIA[index];

                            var add_column_query = "ALTER TABLE kia ADD COLUMN " + columnName;
                            if (field.data_type === 'number') {
                                add_column_query = add_column_query + " INTEGER;";
                            } else if (field.data_type === 'float') {
                                add_column_query = add_column_query + " REAL;";
                            } else if (field.data_type === 'boolean') {
                                add_column_query = add_column_query + " BOOLEAN;";
                            } else {
                                add_column_query = add_column_query + " TEXT;";
                            }

                            $cordovaSQLite.execute(DB, add_column_query).then(function (results) {

                            }, function (error) {
                                if (error.code === 5) {
                                    //Great. Column exists!
                                } else {
                                    console.log(error);
                                }

                            });
                        }


//                        $cordovaSQLite.execute(DB, "DROP TABLE IF EXISTS hha");


                        var hha_query = "CREATE TABLE IF NOT EXISTS hha (id integer primary key)";


                        $cordovaSQLite.execute(DB, hha_query).then(function (result) {

                            _.each(OTHER_HHA_FIELDS, function (field) {

                                var add_column_query = "ALTER TABLE hha ADD COLUMN " + field.field_name;

                                if (field.data_type === 'number') {
                                    add_column_query = add_column_query + " INTEGER;";
                                } else if (field.data_type === 'float') {
                                    add_column_query = add_column_query + " REAL;";

                                } else if (field.data_type === 'boolean') {
                                    add_column_query = add_column_query + " BOOLEAN;";
                                } else {
                                    add_column_query = add_column_query + " TEXT;";
                                }


                                $cordovaSQLite.execute(DB, add_column_query).then(function (results) {
                                    //Great. Column added successfully!
                                }, function (error) {
                                    if (error.code === 5) {
                                        //Great. Column exists!
                                    } else {
                                        console.log(error);
                                    }

                                });

                            });


                        }, function (error) {
                            alert(error);
                            console.log(error);
                        });
                    };


                }])

            .service("OptionService", ["$cordovaSQLite", function ($cordovaSQLite) {

                    this.getOptions = function () {
                        return $cordovaSQLite.execute(DB, "SELECT * FROM options", []);
                    };

                    this.getByGroup = function (groupName) {
                        var resultsArray = [];
                        $cordovaSQLite.execute(
                                DB,
                                "SELECT * FROM options WHERE group_name = ?",
                                [groupName])
                                .then(function (results) {
                                    if (results.rows.length > 0) {
                                        for (var i = 0; i < results.rows.length; i++) {
                                            resultsArray.push(results.rows.item(i));
                                        }
                                    }
                                }, function (error) {
                                    console.log(error);
                                });
                        return resultsArray;
                    };

                    this.getByGroupAndParent = function (groupName, parent) {
                        var resultsArray = [];
                        $cordovaSQLite.execute(
                                DB,
                                "SELECT * FROM options WHERE group_name = ? AND parent = ?",
                                [groupName, parent])
                                .then(function (results) {
                                    if (results.rows.length > 0) {
                                        for (var i = 0; i < results.rows.length; i++) {
                                            resultsArray.push(results.rows.item(i));
                                        }
                                    }
                                }, function (error) {
                                    console.log(error);
                                });
                        return resultsArray;
                    };



                    this.getByGroupAndID = function (groupName, id) {
                        return $cordovaSQLite.execute(DB, "SELECT * FROM options WHERE group_name = ? AND id = ?", [groupName, id]);
                    };

                    this.getByGroupAndWording = function (groupName, wording) {
                        return $cordovaSQLite.execute(DB, "SELECT * FROM options WHERE group_name = ? AND wording = ?", [groupName, wording]);
                    };



                }]);

})(window.angular);


