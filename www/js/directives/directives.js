(function (angular) {
    angular.module("app.directives", [])
            .directive("stringToNumber", function () {
                return {
                    require: "ngModel",
                    link: function (scope, element, attrs, ngModel) {
                        ngModel.$parsers.push(function (value) {
                            return '' + value;
                        });
                        ngModel.$formatters.push(function (value) {
                            return parseFloat(value) || null;
                        });
                    }
                };
            })
            .directive("stringToFloat", function () {
                return {
                    require: "ngModel",
                    link: function (scope, element, attrs, ngModel) {
                        ngModel.$parsers.push(function (value) {
                            return '' + value;
                        });
                        ngModel.$formatters.push(function (value) {
                            return parseFloat(value) || null;
                        });
                    }
                };
            })
            // giving invalid inputs a red border
            .directive("restricted", function() {
                return {
                    scope: {
                        field: '=',
                    },
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        // Some auth check function
                        var isAuthorized = checkAuthorization();
                        if (!isAuthorized) {
                            element.css('display', 'none');
                        }
                    }
                }
            })
            .directive("validationErrors", [function () {
                    return {
                        scope: {
                            field: '@',
                            valerrors: '='
                        },
                        restrict: 'AE',
                        replace: 'true',
                        templateUrl: 'templates/common/validation-errors.html'
                    };
                }
            ]);
})(window.angular);
