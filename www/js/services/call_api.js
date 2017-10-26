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
                    'key': 'make_order',
                    'url': 'delivery_good/delivery_goods/make_delivery_order/',
                },
                {
                    'key': 'orders',
                    'url': 'delivery_order/delivery_orders/',
                },
                {
                    'key': 'location',
                    'url': 'geoloc/geloc/',
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
            $http.defaults.headers.common.Authorization = 'JWT ' + data.token;
            /* istanbul ignore if  */
            if (!_.isUndefined(jQuery)) {
                jQuery.ajaxSetup({
                    headers: {
                        Authorization: 'JWT ' + data.token
                    }
                });
            }
            // JWT
        };
        this.post = function postFxn(data, key, uri) {
            var obj = this.route(key);
            obj.url = !_.isUndefined(uri) ? (obj.url + uri + '/') : obj.url;
            return $http({
                url: _.has(obj, 'auth') ? (AUTH_SERVER_URL + obj.url) : (SERVER_URL + obj.url),
                method: "POST",
                //data: $httpParamSerializer(data),
                data: data,
                headers: {
                    // 'Access-Control-Allow-Origin': '*',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/json',
                },
                responseType : typeof responseType !== "string" ? "json" : responseType
            });
        };
        this.patch = function postFxn(data, key, id, uri) {
            var obj = this.route(key);
            obj.url = obj.url + id + '/';
            obj.url = !_.isUndefined(uri) ? (obj.url + uri + '/') : obj.url;
            return $http({
                url: _.has(obj, 'auth') ? (AUTH_SERVER_URL + obj.url) : (SERVER_URL + obj.url),
                method: "PATCH",
                //data: $httpParamSerializer(data),
                data: data,
                headers: {
                    // 'Access-Control-Allow-Origin': '*',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/json',
                },
                responseType : typeof responseType !== "string" ? "json" : responseType
            });
        };
        this.put = function postFxn(data, key, id, uri) {
            var obj = this.route(key);
            obj.url = obj.url + id + '/';
            obj.url = !_.isUndefined(uri) ? (obj.url + uri + '/') : obj.url;
            return $http({
                url: _.has(obj, 'auth') ? (AUTH_SERVER_URL + obj.url) : (SERVER_URL + obj.url),
                method: "PUT",
                //data: $httpParamSerializer(data),
                data: data,
                headers: {
                    // 'Access-Control-Allow-Origin': '*',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Type': 'application/json',
                },
                responseType : typeof responseType !== "string" ? "json" : responseType
            });
        };
        this.get = function getFxn(data, key, id) {
            var obj = this.route(key);
            this.setToken(data);
            var url = _.has(obj, 'auth') ? (AUTH_SERVER_URL + obj.url) : (SERVER_URL + obj.url),
            url = _.isUndefined(id) ? url : url + id + '/';
            return $http({
                url: url,
                method: "GET",
                data: $httpParamSerializer(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'withCredentials': true,
                },
                responseType : typeof responseType !== "string" ? "json" : responseType
            });
        };
        this.list = function listFxn(data, key, params) {
            var obj = this.route(key);
            this.setToken(data);
            var url = _.has(obj, 'auth') ? (AUTH_SERVER_URL + obj.url) : (SERVER_URL + obj.url);
            return $http({
                url: url,
                method: "GET",
                data: $httpParamSerializer(data),
                params: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'withCredentials': true,
                },
                responseType : typeof responseType !== "string" ? "json" : responseType
            })
        }
        this.customGet = function getFxn(data, uri, id, key) {
            var obj = this.route(key);
            this.setToken(data);
            var url = _.has(obj, 'auth') ? (AUTH_SERVER_URL + obj.url) : (SERVER_URL + obj.url);
            url = url + id + '/' + uri + '/';
            console.log(url);
            return $http({
                url: url,
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
