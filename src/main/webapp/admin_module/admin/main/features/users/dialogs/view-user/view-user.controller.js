(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('ViewUserController', ViewUserController);

    ViewUserController.$inject = ['$scope', '$q', '$uibModalInstance', 'skillService', 'eventService', 'EventTypes'];

    function ViewUserController($scope, $q, $uibModalInstance, skillService, eventService, EventTypes) {
        var self = this;

        self.user = $scope.user;

        self.skills = {
            list: [],
            status: {},
            filter: {},
            filterByCategoryAndLevel: filterByCategoryAndLevel,
            toggleSkillCompletedStatus: toggleSkillCompletedStatus
        };

        self.progress = {
            site: 48,
            division: 85,
            you: 62
        };

        self.certificates = [
            {name: 'Certificate 1 Name', url: '/implementhit/projects/assets/test_certificate.pdf'},
            {name: 'Certificate 2 Name', url: '/implementhit/projects/assets/test_certificate.pdf'},
            {name: 'Certificate 3 Name', url: '/implementhit/projects/assets/test_certificate.pdf'}
        ];

        self.cancel = cancel;
        self.submit = submit;

        init();

        function init() {
            eventService.sendEvent(EventTypes.PAGE_LOADING);

            $q.all([skillService.getSkills()])
                .then(function (results) {
                    self.skills.list = results[0].data['Skills'];
                })
                .finally(function () {
                    eventService.sendEvent(EventTypes.PAGE_LOADED);
                });
        }

        function filterByCategoryAndLevel(skill) {
            var category = self.skills.filter.category || skill['Category'];
            var level = self.skills.filter.level || skill['Level'];

            return (skill['Category'] == category) && (skill['Level'] == level);
        }

        function toggleSkillCompletedStatus(event, skillId) {
            event.preventDefault();
            self.skills.status[skillId] = !self.skills.status[skillId];
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function submit() {
//            userService.editUser(self.user)
//                .then(function(){
//                    self.user.accessLevel = getAccessLevel(self.user.userRole);
//                    delete self.user.userRole;
//                    delete self.user.password;
//
//                    $uibModalInstance.close(self.user);
//                })
//                .catch(function (error) {
//                    alert(error);
//                });
        }
    }
})();