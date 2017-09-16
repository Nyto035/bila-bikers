(function(angular) {
    angular.module('app.services.webSocket', ['ngWebSocket'])
    .factory('$appWs', ['$log', '$websocket', function($log, $websocket) {
    // private
        var closedByUser = false;
        var listeners = {};
        var opened = false;
        var ws;
        function startListeners() {
            ws.onClose(function() {
                opened = false;
                if(!closedByUser) {
                    appWs.init();
                }
            });
            ws.onError(function(err) {
                $log.error(angular.toJson(err));
                ws.close();
            });
            ws.onMessage(function(message) {
                var msg = angular.fromJson(message.data); // JSON is returned from WS Server in the format {code:'string', data:{}}
                appWs.pingListener(msg.code, msg.data); // To activate the necessary handler for the message
            });
            ws.onOpen(function() {
                opened = true;
                if(listeners['webSocketOpened']) {
                    appWs.removeListener('webSocketOpened'); // To notify my app when my WS is opened
                }
            });
        };
        //public
        var appWs = {};
        appWs.addListener = function(code, deferred) {
            listeners[code] = deferred;
        };
        appWs.close = function() {
            closedByUser = true;
            ws.close();
        };
        appWs.init = function() {
            ws = $websocket('ws://localhost:8080');
            startListeners();
        };
        appWs.isOpen = function() {
            return opened;
        };
        appWs.pingListener = function(code, msg) {
            if(listeners[code]) {
                listeners[code].notify(msg);
            }
        };
        appWs.removeListener = function(code) {
            listeners[code].resolve('Listener ' + code + ' terminated successfully');
            delete listeners[code];
        };
        appWs.send = ws.send;
        return appWs;
    }]);
})(window.angular);
