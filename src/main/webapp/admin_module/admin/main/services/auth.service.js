(function() {
    'use strict';

    angular.module('implHit.common')
        .factory('authService', authService);

    authService.$inject = ['$http', '$window', 'Path'];

    function authService($http, $window, Path) {
        return {
            logout: logout,
            getUserInfo: getUserInfo,
            isAuthenticated: isAuthenticated,
            isRegistered: isRegistered
        };

        function getUserInfo() {
            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.USER_INFO
            });
        }

        function logout() {
//            $window.location = Path.API_ENDPOINT_BASE_URL + Path.LOGOUT;
        	$window.location = Path.LOGOUT;
        }

        function isAuthenticated() {
            return true;
        }

        function isRegistered() {
            return true;
        }
    }
})();