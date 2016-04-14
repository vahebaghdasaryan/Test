(function() {
    'use strict';

    angular.module('implHit.common')
        .controller('GeneralErrorController', GeneralErrorController);

    GeneralErrorController.$inject = ['$uibModalInstance', 'message'];

    function GeneralErrorController($uibModalInstance, message) {
        var self = this;

        self.message = message;

        self.cancel = cancel;
        self.submit = submit;

        function cancel() {
            $uibModalInstance.dismiss();
        }

        function submit() {
            $uibModalInstance.close();
        }
    }
})();