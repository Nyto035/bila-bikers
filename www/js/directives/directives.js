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
            ])
            /*Gestures directive*/
            .directive('detectGestures', function($ionicGesture) {
                  return {
                    restrict :  'A',

                    link : function(scope, elem, attrs) {
                        var gestureType = attrs.gestureType;
                        switch(gestureType) {
                        case 'swipe':
                            $ionicGesture.on('swipe', scope.reportEvent, elem);
                            break;
                        case 'swiperight':
                            $ionicGesture.on('swiperight', scope.reportEvent, elem);
                            break;
                        case 'swipeleft':
                            $ionicGesture.on('swipeleft', scope.reportEvent, elem);
                            break;
                        case 'doubletap':
                            $ionicGesture.on('doubletap', scope.reportEvent, elem);
                            break;
                        case 'tap':
                            $ionicGesture.on('tap', scope.reportEvent, elem);
                            break;
                        case 'scroll':
                            $ionicGesture.on('scroll', scope.reportEvent, elem);
                            break;
                        }
                    }
                }
            });
})(window.angular);
