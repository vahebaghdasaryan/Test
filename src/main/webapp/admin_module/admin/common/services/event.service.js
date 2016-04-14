(function () {
    'use strict';

    angular
        .module('implHit.common')
        .factory('eventService', eventService);

    eventService.$inject = ['$rootScope'];

    function eventService($rootScope) {
        var subscribers = {};
        return {
            sendEvent: sendEvent,
            subscribe: subscribe,
            notify: notify
        };

        function sendEvent(event, data) {
            $rootScope.$broadcast(event, data);
        }

        function subscribe(event, handler) {
            if(subscribers[event]) {
                subscribers[event] = [];
            }
            subscribers[event].push(handler);
        }

        function notify(event, data) {
            var handlers = subscribers[event];
            angular.forEach(handlers, function(handler) {
                handler(data);
            })
        }
    }
})();