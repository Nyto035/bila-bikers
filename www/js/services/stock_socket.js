(function(angular) {
    angular.module('app.services.webSockets', ['ngWebSocket'])

    .factory('socket', socketFactory)

    .factory('locSocket', locationSocket)

    .service('$myWebSocket', Socket);

    socketFactory.$inject = ['LOCATION_HOST', '$websocket'];

    function socketFactory(locationHost, $websocket) {
        const url = 'ws://'+locationHost+':8000/delivery/';
        const mySocket = $websocket(url);
        return mySocket;
    }

    locationSocket.$inject = ['LOCATION_HOST', '$websocket'];

    function locationSocket(locationHost, $websocket) {
        const url = 'ws://'+locationHost+':8000/geoloc/';
        const locSocket = $websocket(url);
        return locSocket;
    }

    Socket.$inject = ['socket', 'locSocket', '$rootScope'];
    function Socket(socket, locSocket, $rootScope) {
        const self = this;
        // Open a Websocket connection
        let listeners = [];

        self.onMessage = function onMessage() {
            self.collection = '';
            socket.onMessage((message) => {
                self.collection = JSON.parse(message.data);
                angular.forEach(listeners, (listener) => {
                    // wrap this in $apply ???
                    listener(self.collection);
                });
                $rootScope.$emit('delivery_data', message);
                return message;
            });
        };

        self.onLocMessage = function onLocFxn() {
            self.collection = '';
            locSocket.onMessage((message) => {
                self.locCollection = JSON.parse(message.data);
                angular.forEach(listeners, (listener) => {
                    // wrap this in $apply ???
                    listener(self.locCollection);
                });
                $rootScope.$emit('location_data', message);
                return message;
            });
        };

        self.sendMessage = function sendMessage(data) {
            socket.send(JSON.stringify(data));
        };
        /**
             * @ngdoc method
             * @name register
             *
             * @param {function} fxn Listener to be called
             *
             * @returns {boolean} `true` if a new registration was done, `false` otherwise
             *
             * @description
             * Registers a listener to be executed when an update is received
             *
        */
        self.register = function register(arg, fxn) {
            if (_.contains(listeners, fxn)) {
                return false;
            }
            listeners.push(fxn);
            return true;
        };
        /**
         * @ngdoc method
         * @name deRegister
         *
         * @param {function} fxn Listener to be removed
         *
         * @returns {boolean} `true` de-registration succeeds, `false` otherwise
         *
         * @description
         * Removes a listener from list of listeners, if it was registered
         *
         */
        self.deRegister = function deRegister(fxn) {
            if (!_.contains(listeners, fxn)) {
                return false;
            }
            listeners = _.without(listeners, fxn);
            return true;
        };
        self.onMessage();
        self.onLocMessage();
    }

    /*.factory('$myWebSocket', ['$log', '$websocket', 'LOCATION_HOST',
        function($log, $websocket, LOCATION_HOST) {
        var dataStream = $websocket('ws://'+LOCATION_HOST+':8080/v1/order_delivery/');
        var collection = [];
        dataStream.onMessage(function(message) {
            collection.push(JSON.parse(message.data));
        });

        var methods = {
            collection: collection,
            get: function() {
              dataStream.send(JSON.stringify({ action: 'get' }));
            }
        };
        return methods;
    }]);*/
})(window.angular);
