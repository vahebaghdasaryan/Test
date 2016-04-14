(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('DeleteUserController', DeleteUserController);

    DeleteUserController.$inject = ['$scope', '$uibModalInstance', 'userService', 'eventService', 'EventTypes'];

    function DeleteUserController($scope, $uibModalInstance, userService, eventService, EventTypes) {
        var self = this;

        self.user = $scope.selectedUser;

        self.cancel = cancel;
        self.submit = submit;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function submit() {
            self.loading = true;
            var usersEmailList = [self.user['Email']];

            userService.deleteUser(usersEmailList)
                .then(function(){
                    $uibModalInstance.close({
                        userId: self.user['User Id']
                    });
                })
                .catch(function (error) {
                    eventService.sendEvent(EventTypes.ALERT_WARNING, error.data.reason);
                })
                .finally(function () {
                    self.loading = false;
                });
        }
    }
})();