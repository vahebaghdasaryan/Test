(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('UpdateLoginMessageController', UpdateLoginMessageController);

    UpdateLoginMessageController.$inject = ['$scope', 'domainService', '$uibModalInstance'];

    function UpdateLoginMessageController($scope, domainService, $uibModalInstance) {
        var self = this;

        self.message = $scope.message;

        self.cancel = cancel;
        self.submit = submit;


        function cancel(){
            $uibModalInstance.dismiss('cancel');
        }

        function submit(){
            domainService.updateLoginMessage(self.message)
                .then(function(){
                    $uibModalInstance.close(self.message);
                })
                .catch(function () {
                    $uibModalInstance.dismiss('cancel');
                })
                .finally(function () {

                });
        }
    }
})();