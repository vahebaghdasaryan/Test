(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('AssignRolesController', AssignRolesController);

    AssignRolesController.$inject = ['$scope', '$q', '$uibModalInstance', 'roleService', 'utilService', 'eventService', 'EventTypes'];

    function AssignRolesController($scope, $q, $uibModalInstance, roleService, utilService, eventService, EventTypes) {
        var self = this;

        self.selectedUsers = $scope.selectedUsers;

        self.allRoles = $scope.allRoles;
        self.currentRoles = $scope.currentRoles;

        self.selectedRoles = angular.copy(self.currentRoles);
        self.assignedRoles = [];
        self.unAssignedRoles = [];

        self.sendEmail = false;
        self.emailToSend = $scope.ac.userInfo['prefEmail'];

        self.rolesFilter = rolesFilter;

        self.cancel = cancel;
        self.submit = submit;

        function rolesFilter(query) {
            return self.allRoles.filter(function(role) {
                return role.toLowerCase().indexOf(query.toLowerCase()) != -1;
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function submit() {
            parse();

            var usersEmailList = utilService.fetchPropertyArray(self.selectedUsers, 'Email');
            var promises = [];

            if(self.assignedRoles.length > 0) {
                var assignRoles = roleService.assignRoles(usersEmailList, self.assignedRoles, self.sendEmail, self.emailToSend);
                promises.push(assignRoles);
            }
            if(self.unAssignedRoles.length > 0) {
                var unAssignRoles = roleService.unAssignRoles(usersEmailList, self.unAssignedRoles, self.sendEmail, self.emailToSend);
                promises.push(unAssignRoles)
            }

            $q.all(promises)
                .then(function(result) {
                    if(self.newCreatedRoles.length > 0) {
                        eventService.sendEvent(EventTypes.ALERT_INFO, 'Roles <b>' + self.newCreatedRoles + '</b> was successfully created');
                    }

                    $uibModalInstance.close({
                        userIdList: utilService.fetchPropertyArray(self.selectedUsers, 'User Id'),
                        assignedRoles: self.assignedRoles,
                        unAssignedRoles: self.unAssignedRoles,
                        newCreatedRoles: self.newCreatedRolesArray
                    });
                })
                .catch(function (error) {
                    console.error(error);
                    eventService.sendEvent(EventTypes.ALERT_WARNING, 'Something goes wrong');
                });
        }

        function parse() {
            self.selectedRoles = self.selectedRoles.map(function (tag) {
                return tag.text.trim();
            });

            self.newCreatedRolesArray = [];
            self.newCreatedRoles = '';
            for(var i = 0; i < self.selectedRoles.length; i++) {
                var role = self.selectedRoles[i];
                if(self.allRoles.indexOf(role) == -1) {
                    self.newCreatedRoles += role + ',';
                    self.newCreatedRolesArray.push(role);
                    self.allRoles.push(role);
                }
            }

            self.assignedRoles = self.selectedRoles.filter(function(role) {
                return self.currentRoles.indexOf(role) == -1;
            });

            self.unAssignedRoles = self.currentRoles.filter(function(role) {
                return self.selectedRoles.indexOf(role) == -1;
            });
        }
    }
})();