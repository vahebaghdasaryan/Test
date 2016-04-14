(function() {
    'use strict';

    angular
        .module('implHit.admin')
        .factory('customHttpInterceptor', customHttpInterceptor);

    customHttpInterceptor.$inject = ['$q', '$window', '$location', 'eventService', 'EventTypes', 'Path'];

    function customHttpInterceptor($q, $window, $location, eventService, EventTypes, Path) {
        return {
            response: response,
            responseError: responseError
        };

        function responseError(error) {
            switch (error.status) {
                case 401:
                    var redirectUrl = $location.absUrl();
                    $window.location = Path.LOGIN + '?url=' + redirectUrl;
                    break;
                case 500:
                    eventService.sendEvent(EventTypes.GENERAL_ERROR);
                    break;
            }

            return $q.reject(error);
        }

        function response(response) {
            if(response.data && angular.isDefined(response.data.valid) && !response.data.valid) {

                if(response.data.reason == "Please log-in before attemting this call") {
                    var redirectUrl = $location.absUrl();
                    $window.location = Path.LOGIN + '?url=' + redirectUrl;
                }

                // *** calling $q.reject to pass through to error callback
                return $q.reject(response);
            }
            return response;
        }
    }
})();