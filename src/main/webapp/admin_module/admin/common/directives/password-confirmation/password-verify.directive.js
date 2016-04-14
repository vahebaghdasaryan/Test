(function() {
    'use strict';

    angular
        .module('implHit.common')
        .directive('passwordVerify', passwordVerify);

    passwordVerify.$inject = [];

    function passwordVerify() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                passwordVerify: '='
            },
            link: link
        };

        function link(scope, element, attrs, ngModel) {
            ngModel.$validators.passwordVerify = function(modelValue) {
                return modelValue == scope.passwordVerify;
            };

            scope.$watch("passwordVerify", function() {
                ngModel.$validate();
            });
        }
    }
})();