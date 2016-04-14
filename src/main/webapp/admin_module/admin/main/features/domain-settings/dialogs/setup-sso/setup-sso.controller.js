(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('SetupSSOController', SetupSSOController);

    SetupSSOController.$inject = ['$scope', 'domainService', '$uibModalInstance'];

    function SetupSSOController($scope, domainService, $uibModalInstance) {
        var self = this;

        self.ssoConfig = $scope.ssoConfig;

        self.cancel = cancel;
        self.submit = submit;


        function cancel(){
            $uibModalInstance.dismiss('cancel');
        }

        function submit(){
            domainService.setupSSO(self.ssoConfig)
                .then(function(){
                    $uibModalInstance.close(self.ssoConfig);
                })
                .catch(function () {
                    $uibModalInstance.dismiss('cancel');
                })
                .finally(function () {

                });
        }
    }
})();