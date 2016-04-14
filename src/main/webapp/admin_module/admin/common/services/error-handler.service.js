(function () {
    'use strict';

    angular
        .module('implHit.common')
        .factory('errorHandler', errorHandler);

    errorHandler.$inject = ['$uibModal'];

    function errorHandler($uibModal) {
        return {
            openGeneralErrorDialog: openGeneralErrorDialog
        };

        function openGeneralErrorDialog(message) {
            $uibModal.open({
                templateUrl: 'common/views/dialogs/general-error/general-error.template.html',
                controller: 'GeneralErrorController',
                controllerAs: 'dc',
                resolve : {
                    "message" : function() { return message; }
                }
            });
        }
    }
})();