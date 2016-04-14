(function() {
    'use strict';

    angular
        .module('implHit.common')
        .directive('topHeader', topHeader);

    topHeader.$inject = [];

    function topHeader() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'admin/common/views/layout/header.html'
        };
    }
})();