(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('ChangePasswordController', ChangePasswordController);

    ChangePasswordController.$inject = ['$scope', 'domainService', '$uibModalInstance'];

    function ChangePasswordController($scope, domainService, $uibModalInstance) {
        var self = this;

        self.oldPassword = null;
        self.newPassword = null;
        self.confirmPassword = null;

        self.cancel = cancel;
        self.submit = submit;


        function cancel(){
            $uibModalInstance.dismiss('cancel');
        }

        function submit(){
//            domainService.changePassword(self.oldPassword, self.newPassword)
//                .then(function(){
                    $uibModalInstance.close();
//                })
//                .catch(function () {
//                    $uibModalInstance.dismiss('cancel');
//                })
//                .finally(function () {
//
//                });
        }
    }
})();