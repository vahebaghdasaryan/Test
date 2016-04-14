(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('BulkDeleteUsersController', BulkDeleteUsersController);

    BulkDeleteUsersController.$inject = ['$scope', '$uibModalInstance', 'userService', 'utilService', 'eventService', 'EventTypes'];

    function BulkDeleteUsersController($scope, $uibModalInstance, userService, utilService, eventService, EventTypes) {
        var self = this;

        self.selectedUsers = $scope.selectedUsers;
        self.deletedUsersCount = $scope.selectedUsers.length;

        self.cancel = cancel;
        self.submit = submit;


        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function submit() {
            self.loading = true;
            var usersEmailList = utilService.fetchPropertyArray(self.selectedUsers, 'Email');

            userService.deleteUser(usersEmailList)
                .then(function() {
                    $uibModalInstance.close({
                        userIdList: utilService.fetchPropertyArray(self.selectedUsers, 'User Id')
                    });
                })
                .catch(function () {
                    eventService.sendEvent(EventTypes.ALERT_WARNING, error.data.reason);
                })
                .finally(function () {
                    self.loading = true;
                });
        }
    }
})();