(function(angular) {
    angular.module('app.services.webSockets', ['ngWebSocket'])
    .factory('$myWebSocket', ['$log', '$websocket', function($log, $websocket) {
    // private
        // Open a WebSocket connection
        var dataStream = $websocket('ws://website.com/data');
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
    }]);
})(window.angular);
