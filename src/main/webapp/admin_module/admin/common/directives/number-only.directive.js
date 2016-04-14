(function() {
    'use strict';

    angular
        .module('implHit.common')
        .directive('numberOnly', numberOnly);

    numberOnly.$inject = [];

    function numberOnly() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };

        function link(scope, element, attrs, ngModelCtrl) {

            ngModelCtrl.$parsers.push(parser);

            function parser(value) {
                if(isNaN(value.slice(-1))) {
                    var prev = value.substring(0, value.length-1);

                    ngModelCtrl.$setViewValue(prev);
                    ngModelCtrl.$render();

                    return Number(prev);
                }

                return Number(value);
            }
        }
    }
})();