(function(angular, _) {
    angular.module('app.services.callApi', [])
    .factory('testInterceptor', testInterceptor)
    .service('apiBackend',['$http', 'SERVER_URL', '$httpParamSerializer',
        function($http, SERVER_URL, $httpParamSerializer) {
        this.route = function urlFxn(key) {
            var urlObj = [
                {
                    'key': 'user',
                    'url': 'user/users/',
                }
            ];
            var ind = _.indexOf(urlObj, _.findWhere(urlObj, { 'key': key }));
            return urlObj[ind].url;
        };
        this.post = function postFxn(data, key) {
            var url = this.route(key);
            return $http({
                url: SERVER_URL + url,
                method: "POST",
                data: $httpParamSerializer(data),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                responseType : typeof responseType !== "string" ? "json" : responseType
            });
        };
    }])

    function testInterceptor() {
        return {
            request: function(config) {
            return config;
        },

        requestError: function(config) {
            return config;
        },

        response: function(res) {
            return res;
        },

        responseError: function(res) {
            return res;
        }
      }
    };
})(window.angular, window._);
