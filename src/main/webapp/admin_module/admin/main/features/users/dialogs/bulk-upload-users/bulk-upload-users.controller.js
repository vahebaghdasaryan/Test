(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('BulkLoadUsersController', BulkLoadUsersController);

    BulkLoadUsersController.$inject = ['$scope', '$uibModalInstance', 'userService', 'eventService', 'EventTypes'];

    function BulkLoadUsersController($scope, $uibModalInstance, userService, eventService, EventTypes) {
        var self = this;

        var prefEmail = $scope.ac.userInfo['prefEmail'];

        self.data = {
            uploadType : 'userBulkUpload',
            removeUser: false,
            email: prefEmail,
            ignoreAutoAssign: false,
            forceAutoAssign: false,
            sendEmail: false
        };

        self.cancel = cancel;
        self.submit = submit;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function submit() {
            userService.bulkUploadUsers(self.data)
                .then(function() {
                    eventService.sendEvent(EventTypes.ALERT_INFO, 'File was successfully loaded');
                    $uibModalInstance.close();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
})();