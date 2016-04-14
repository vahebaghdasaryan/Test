(function() {
    'use strict';

    angular
        .module('implHit.common')
        .directive('formGeneralError', formGeneralError);

    formGeneralError.$inject = [];

    function formGeneralError() {
        return {
            restrict: 'E',
            templateUrl: 'admin/common/directives/form-general-error/form-general-error.template.html',
            scope: {
                form: '=?'
            }
        };
    }
})();