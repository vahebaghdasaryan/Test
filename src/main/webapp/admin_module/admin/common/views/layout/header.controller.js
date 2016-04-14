(function () {
    'use strict';

    angular.module('implHit.common')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['authService'];

    function HeaderController(authService) {
        var self = this;

        self.performLogout = performLogout;

        function performLogout() {
            authService.logout();
        }
    }
})();