(function (angular) {
    angular.module("app.hsna_database", [])

            .service("HSNADBService", ["$cordovaSQLite", "AuthService",
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

                    var HSNA = [
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
                            section: 'Household Details',
                            getDefaultValue: function () {
                                return AuthService.getUser().county;
                            }
                        },
                        {
                            field_name: 'sub_county',
                            verbose_name: 'Sub County',
                            required: true,
                            data_type: 'text',
                            section: 'Household Details'
                        },
                        {
                            field_name: 'sub_location',
                            verbose_name: 'Sub Location',
                            required: true,
                            data_type: 'text',
                            section: 'Household Details'
                        },
                        {
                            field_name: 'household_name',
                            verbose_name: 'Household head name',
                            required: true,
                            data_type: 'text',
                            section: 'Background'
                        },
                        {
                            field_name: 'community_name',
                            verbose_name: 'Community name',
                            required: true,
                            data_type: 'text',
                            section: 'Household Details'
                        },
                        {
                            field_name: 'interview_date',
                            verbose_name: 'Interview date',
                            required: true,
                            data_type: 'date',
                            section: 'Household Details',
                            getDefaultValue: function () {
                                return new Date().toISOString();
                            }
                        },
                        {
                            field_name: 'id_number',
                            required: false,
                            data_type: 'number',
                            section: 'Household Details'
                        },
                        {
                            field_name: 'receive_money',
                            verbose_name: 'Did you receive cash from the Govenment',
                            required: false,
                            data_type: 'boolean',
                            section: 'General Cash',
                            default_value: false
                        },
                        {
                            field_name: 'ovc',
                            verbose_name: 'OVC',
                            required: false,
                            data_type: 'boolean',
                            section: 'General Cash',
                            default_value: false
                        },
                        {
                            field_name: 'op',
                            verbose_name: 'OP',
                            required: false,
                            data_type: 'boolean',
                            section: 'General Cash',
                            default_value: false
                        },
                        {
                            field_name: 'pwsd',
                            verbose_name: 'PWSD',
                            required: false,
                            data_type: 'boolean',
                            section: 'General Cash',
                            default_value: false
                        },
                        {
                            field_name: 'hsnp',
                            verbose_name: 'HSNP',
                            required: false,
                            data_type: 'boolean',
                            section: 'General Cash',
                            default_value: false
                        },
                        {
                            field_name: 'jan',
                            verbose_name: 'Amount received in January',
                            required: false,
                            data_type: 'number',
                            section: 'Cash Payments'
                        },
                        {
                            field_name: 'feb',
                            verbose_name: 'Amount received in February',
                            required: false,
                            data_type: 'number',
                            section: 'Cash Payments'
                        },
                        {
                            field_name: 'mar',
                            verbose_name: 'Amount received in March',
                            required: false,
                            data_type: 'number',
                            section: 'Cash Payments'
                        },
                        {
                            field_name: 'apr',
                            verbose_name: 'Amount received in April',
                            required: false,
                            data_type: 'number',
                            section: 'Cash Payments'
                        },
                        {
                            field_name: 'may',
                            verbose_name: 'Amount received in May',
                            required: false,
                            data_type: 'number',
                            section: 'Cash Payments'
                        },
                        {
                            field_name: 'jun',
                            verbose_name: 'Amount received in June',
                            required: false,
                            data_type: 'number',
                            section: 'Cash Payments'
                        },
                        {
                            field_name: 'total_received',
                            verbose_name: 'Total Amount received',
                            required: false,
                            data_type: 'number',
                            section: 'Cash Payments'
                        },
                        {
                            field_name: 'hsnp_staff',
                            verbose_name: 'HSNP Staff',
                            required: false,
                            data_type: 'boolean',
                            section: 'Cash Payments',
                            default_value: false
                        },
                        {
                            field_name: 'chiefs',
                            verbose_name: 'Chiefs/Assistant Chiefs',
                            required: false,
                            data_type: 'boolean',
                            section: 'Cash Payments',
                            default_value: false
                        },
                        {
                            field_name: 'elders',
                            verbose_name: 'Elders',
                            required: false,
                            data_type: 'boolean',
                            section: 'Cash Payments',
                            default_value: false
                        },
                        {
                            field_name: 'radio',
                            verbose_name: 'Heard on radio',
                            required: false,
                            data_type: 'boolean',
                            section: 'Cash Payments',
                            default_value: false
                        },
                        {
                            field_name: 'relatives',
                            verbose_name: 'Told by friends, family, neighbors',
                            required: false,
                            data_type: 'boolean',
                            section: 'Cash Payments',
                            default_value: false
                        },
                        {
                            field_name: 'equity_agent',
                            verbose_name: 'Equity agent / duka owner',
                            required: false,
                            data_type: 'boolean',
                            section: 'Cash Payments',
                            default_value: false
                        },
                        {
                            field_name: 'other_sources',
                            verbose_name: 'Other Sources (Specify)',
                            required: false,
                            data_type: 'boolean',
                            section: 'Cash Payments',
                            default_value: false
                        },
                        {
                            field_name: 'other_specified_sources',
                            verbose_name: 'Other Specified Sources',
                            required: false,
                            data_type: 'text',
                            section: 'Cash Payments',
                            default_value: false
                        },
                        {
                            field_name: 'spent_money',
                            verbose_name: 'Have you spent cash received from the Govenment',
                            required: false,
                            data_type: 'boolean',
                            section: 'Payment Utilization',
                            default_value: false
                        },
                        {
                            field_name: 'percentage_spent',
                            verbose_name: 'Percentage Spent',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'maize_rice_posho',
                            verbose_name: 'Amount spent on maize, rice, posho',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'pulses',
                            verbose_name: 'Amount spent on pulses - beans/lentils etc',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'oil',
                            verbose_name: 'Amount spent on oil',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'sugar',
                            verbose_name: 'Amount spent on sugar',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'milk',
                            verbose_name: 'Amount spent on milk',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'meat',
                            verbose_name: 'Amount spent on meat',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'other_foods',
                            verbose_name: 'Amount spent on other foods (specify)',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'purchase_livestock',
                            verbose_name: 'Amount spent to purchase livestock',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'purchase_water',
                            verbose_name: 'Amount spentto purchase water',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'hiring_labor',
                            verbose_name: 'Amount spent on hiring of labor',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'purchasing_medicine',
                            verbose_name: 'Amount spent to purchase medicines',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'school_fees',
                            verbose_name: 'Amount spent on shool fees',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'purchase_of_household',
                            verbose_name: 'Amount spent to purchase household products',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'other_foods',
                            verbose_name: 'Amount spent on other foods (specify)',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'travel_expenses',
                            verbose_name: 'Amount spent on travel expenses',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'purchase_of_entertainment',
                            verbose_name: 'Amount spent on entertainment',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'gifts',
                            verbose_name: 'Amount spent on gifts and loans to others',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'loans',
                            verbose_name: 'Amount spent on loans and debt repayment',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'rental',
                            verbose_name: 'Amount spent on rent, house maintenance and repair',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'other_items',
                            verbose_name: 'Amount spent on other items (specify)',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'cant_remember',
                            verbose_name: 'Amount spent but can\'t remember spending',
                            required: false,
                            data_type: 'number',
                            section: 'Payment Utilization'
                        },
                        {
                            field_name: 'other_comments',
                            verbose_name: 'Any other comments observed',
                            required: false,
                            data_type: 'text',
                            section: 'Other Assistance Received'
                        },
                        {
                            field_name: 'food_aid',
                            verbose_name: 'Food aid to the household',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'school_feeding',
                            verbose_name: 'School Feeding',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'supplementary_feeding',
                            verbose_name: 'Suplementary Feeding',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'klp',
                            verbose_name: 'Kenya Livestock Insurance Program',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'increased_spending',
                            verbose_name: 'Did expenditure on forage, fodder increase due to KLP payment',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'ngo_payment',
                            verbose_name: 'Receipt of payment from Non Government sources e.g NGOs',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'water_tankering',
                            verbose_name: 'Water tankering',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'relief_destocking',
                            verbose_name: 'Relief Destocking',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'fodder_distribution',
                            verbose_name: 'Fodder distribution',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'livestock_vaccination',
                            verbose_name: 'Livestock vaccination/healthcare',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'other_assistance',
                            verbose_name: 'Other assistance (specify)',
                            required: false,
                            data_type: 'boolean',
                            section: 'Other Assistance Received',
                            default_value: false
                        },
                        {
                            field_name: 'other_specified_assistance',
                            verbose_name: 'Other specified assistance',
                            required: false,
                            data_type: 'text',
                            section: 'Other Assistance Received',
                            default_value: false
                        }];




                    var HSNA_SECTIONS = [
                        {
                            name: 'Household Details',
                            state_name: 'app.hsna.hsna_household',
                            next: 'app.hsna.hsna_generalcash',
                            previous: ''
                        },
                        {
                            name: 'General Cash',
                            state_name: 'app.hsna.hsna_generalcash',
                            next: 'app.hsna.hsna_cashpayments',
                            previous: 'app.hsna.hsna_household'
                        },
                        {
                            name: 'Cash Payments',
                            state_name: 'app.hsna.hsna_cashpayments',
                            next: 'app.hsna.hsna_paymentutilization',
                            previous: 'app.hsna.hsna_generalcash'
                        },
                        {
                            name: 'Payment Utilization',
                            state_name: 'app.hsna.hsna_paymentutilization',
                            next: 'app.hsna.hsna_assistance_received',
                            previous: 'app.hsna.hsna_cashpayments'
                        },
                        {
                            name: 'Other Assisstance Received',
                            state_name: 'app.hsna.hsna_assistance_received',
                            next: '',
                            previous: 'app.hsna.hsna_paymentutilization'
                        }];


                    this.getNextSection = function (current) {
                        var next_section = false;
                        _.each(HSNA_SECTIONS, function (section) {
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
                        _.each(HSNA_SECTIONS, function (section) {
                            if (section.name === current) {
                                if (section.previous) {
                                    previous_section = section.previous;
                                }
                            }
                        });
                        return previous_section;
                    };

                    this.getHSNAFields = function () {
                        return HSNA;
                    };

                    this.initialize = function () {

//                      $cordovaSQLite.execute(DB, "DROP TABLE IF EXISTS options");

                        var query = "CREATE TABLE IF NOT EXISTS hsna (id integer primary key)";

                        $cordovaSQLite.execute(DB, query).then(function () {

                        }, function (error) {
                            alert(error);
                        });

                        for (var index = 0; index < HSNA.length; index++) {
                            var columnName = HSNA[index].field_name;
                            var field = HSNA[index];

                            var add_column_query = "ALTER TABLE hsna ADD COLUMN " + columnName;
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
                    };

                }]);
})(window.angular);


