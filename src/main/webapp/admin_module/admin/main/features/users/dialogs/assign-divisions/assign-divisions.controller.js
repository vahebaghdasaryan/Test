(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('AssignDivisionsController', AssignDivisionsController);

    AssignDivisionsController.$inject = ['$scope', '$q', '$uibModalInstance', 'divisionService', 'utilService', 'eventService', 'EventTypes'];

    function AssignDivisionsController($scope, $q, $uibModalInstance, divisionService, utilService, eventService, EventTypes) {
        var self = this;

        self.selectedUsers = $scope.selectedUsers;

        self.allDivisions = $scope.allDivisions;
        self.currentDivisions = $scope.currentDivisions;

        self.selectedDivisions = angular.copy(self.currentDivisions);
        self.assignedDivisions = [];
        self.unAssignedDivisions = [];

        self.sendEmail = false;
        self.emailToSend = $scope.ac.userInfo['prefEmail'];

        self.divisionsFilter = divisionsFilter;

        self.cancel = cancel;
        self.submit = submit;

        function divisionsFilter(query) {
            return self.allDivisions.filter(function(division) {
                return division.toLowerCase().indexOf(query.toLowerCase()) != -1;
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function submit() {
            parse();

            var usersEmailList = utilService.fetchPropertyArray(self.selectedUsers, 'Email');
            var promises = [];

            if(self.assignedDivisions.length > 0) {
                var assignDivisions = divisionService.assignDivisions(usersEmailList, self.assignedDivisions, self.sendEmail, self.emailToSend);
                promises.push(assignDivisions);
            }

            if(self.unAssignedDivisions.length > 0) {
                var unAssignDivisions = divisionService.unAssignDivisions(usersEmailList, self.unAssignedDivisions, self.sendEmail, self.emailToSend);
                promises.push(unAssignDivisions);
            }

            $q.all(promises)
                .then(function(result) {
                    if(self.newCreatedSpecialties.length > 0) {
                        eventService.sendEvent(EventTypes.ALERT_INFO, 'Specialties <b>' + self.newCreatedSpecialties + '</b> was successfully created');
                    }

                    $uibModalInstance.close({
                        userIdList: utilService.fetchPropertyArray(self.selectedUsers, 'User Id'),
                        assignedDivisions: self.assignedDivisions,
                        unAssignedDivisions: self.unAssignedDivisions,
                        newCreatedDivisions: self.newCreatedSpecialtiesArray
                    });
                })
                .catch(function (error) {
                    console.error(error);
                    eventService.sendEvent(EventTypes.ALERT_WARNING, 'Something goes wrong');
                });
        }

        function parse() {
            self.selectedDivisions = self.selectedDivisions.map(function (tag) {
                return tag.text.trim();
            });

            self.newCreatedSpecialtiesArray = [];
            self.newCreatedSpecialties = '';
            for(var i = 0; i < self.selectedDivisions.length; i++) {
                var specialty = self.selectedDivisions[i];
                if(self.allDivisions.indexOf(specialty) == -1) {
                    self.newCreatedSpecialties += specialty + ',';
                    self.newCreatedSpecialtiesArray.push(specialty);
                    self.allDivisions.push(specialty);
                }
            }

            self.assignedDivisions = self.selectedDivisions.filter(function(role) {
                return self.currentDivisions.indexOf(role) == -1;
            });

            self.unAssignedDivisions = self.currentDivisions.filter(function(role) {
                return self.selectedDivisions.indexOf(role) == -1;
            });
        }
    }
})();