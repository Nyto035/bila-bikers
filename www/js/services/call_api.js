(function(angular, _, jQuery) {
    angular.module('app.services.callApi', [])
    .factory('testInterceptor', testInterceptor)
    .service('apiBackend',['$http', 'SERVER_URL', '$httpParamSerializer', 'AUTH_SERVER_URL',
        function($http, SERVER_URL, $httpParamSerializer, AUTH_SERVER_URL) {
        this.route = function urlFxn(key) {
            var urlObj = [
                {
                    'key': 'user',
                    'url': 'user/users/',
                },
                {
                    'key': 'login',
                    'url': 'auth/api-token-auth/',
                    'auth': true,
                },
                {
                    'key': 'me',
                    'url': 'me/',
                    'auth': true,
                },
            ];
            var ind = _.indexOf(urlObj, _.findWhere(urlObj, { 'key': key }));
            return urlObj[ind];
        };
        this.setToken = function setFxn(data) {
            $http.defaults.headers.common.Authorization = data.token;
            /* istanbul ignore if  */
            if (!_.isUndefined(jQuery)) {
                jQuery.ajaxSetup({
                    headers: {
                        Authorization: data.token
                    }
                });
            } else {
                console.log('No JQuery');
            }
            // JWT
        };
        this.post = function postFxn(data, key) {
            var obj = this.route(key);
            return $http({
                url: _.has(obj, 'auth') ? (AUTH_SERVER_URL + obj.url) : (SERVER_URL + obj.url),
                method: "POST",
                data: $httpParamSerializer(data),
                headers: {
                    // 'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                responseType : typeof responseType !== "string" ? "json" : responseType
            });
        };
        this.get = function getFxn(data, key) {
            var obj = this.route(key);
            this.setToken(data);
            return $http({
                url: _.has(obj, 'auth') ? (AUTH_SERVER_URL + obj.url) : (SERVER_URL + obj.url),
                method: "GET",
                data: $httpParamSerializer(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'withCredentials': true,
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
})(window.angular, window._, window.jQuery);
