(function() {
    'use strict';

    angular
        .module('implHit.common')
        .directive('alertMessage', alertMessage);

    alertMessage.$inject = ['$timeout', 'EventTypes'];

    function alertMessage($timeout, EventTypes) {
        return {
            restrict: 'E',
            templateUrl: 'admin/common/directives/alert-message/alert-info.template.html',
            link: link
        };

        function link(scope, element, attrs) {
            scope.queue = [];
            scope.notifications = [];
            scope.show = false;
            scope.style = {
                top: '0'
            };

            scope.$on(EventTypes.ALERT_INFO, handleInfo);
            scope.$on(EventTypes.ALERT_WARNING, handleWarning);

            function handleInfo(event, message) {
                if(!scope.show) {
                    showMessage(message, 'info');
                } else {
                    var notification = {
                        message: message,
                        type: 'info'
                    };

                    if(scope.notifications.length < 5) {
                        scope.notifications.push(notification)
                    } else {
                        scope.queue.push(notification);
                    }
                }
            }

            function handleWarning(event, message) {
                if(!scope.show) {
                    showMessage(message, 'warning');
                } else {
                    var notification = {
                        message: message,
                        type: 'warning'
                    };

                    if(scope.notifications.length < 5) {
                        scope.notifications.push(notification)
                    } else {
                        scope.queue.push(notification);
                    }
                }
            }

            function showMessage(message, type) {
                scope.message = message;
                scope.type = type;
                scope.style.top = ((window.scrollY + 30) + 'px');
                scope.show = true;

                $timeout(function() {
                    scope.show = false;
                    scope.notifications = [];
                    processQueue();
                }, 6000);
            }

            function processQueue() {
                if(scope.queue.length > 0) {
                    var item = scope.queue.shift();
                    $timeout(function() {
                        showMessage(item.message, item.type);
                        fillNotifications();
                    }, 500);

                }
            }

            function fillNotifications() {
                if(scope.queue.length < 5) {
                    scope.notifications = scope.queue;
                } else {
                    var tmp = scope.queue.splice(5);
                    scope.notifications = scope.queue;
                    scope.queue = tmp;
                }
            }
        }
    }
})();