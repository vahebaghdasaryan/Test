(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('AssignSitesController', AssignSitesController);

    AssignSitesController.$inject = ['$scope', '$q', '$uibModalInstance', 'siteService', 'utilService', 'eventService', 'EventTypes'];

    function AssignSitesController($scope, $q, $uibModalInstance, siteService, utilService, eventService, EventTypes) {
        var self = this;

        self.selectedUsers = $scope.selectedUsers;

        self.allSites = $scope.allSites;
        self.currentSites = $scope.currentSites;

        self.selectedSites = initSelectedSites(self.currentSites, self.allSites);
        self.assignedSites = [];
        self.unAssignedSites = [];

        self.sendEmail = false;
        self.emailToSend = $scope.ac.userInfo['prefEmail'];

        self.sitesFilter = sitesFilter;

        self.cancel = cancel;
        self.submit = submit;

        function initSelectedSites(currentSites, allSites) {
            return currentSites.map(function(site) {
                return {
                    SiteId: site.id,
                    SiteName: site.name
                }
            });
        }

        function sitesFilter(query) {
            return self.allSites.filter(function(item) {
                return item['SiteName'].toLowerCase().indexOf(query.toLowerCase()) != -1;
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }


        function submit() {
            parse();

            var assignedSitesKeys = self.assignedSites.map(function(item) {
                return item['SiteId'];
            });

            var unAssignedSitesKeys = self.unAssignedSites.map(function(item) {
                return item['SiteId'];
            });

            var usersEmailList = utilService.fetchPropertyArray(self.selectedUsers, 'Email');
            var promises = [];

            if(assignedSitesKeys.length > 0) {
                var assignSites = siteService.assignSites(usersEmailList, assignedSitesKeys, self.sendEmail, self.emailToSend);
                promises.push(assignSites);
            }

            if(unAssignedSitesKeys.length > 0) {
                var unAssignSites = siteService.unAssignSites(usersEmailList, unAssignedSitesKeys, self.sendEmail, self.emailToSend);
                promises.push(unAssignSites);
            }

            $q.all(promises)
                .then(function(response) {
                    $uibModalInstance.close({
                        userIdList: utilService.fetchPropertyArray(self.selectedUsers, 'User Id'),
                        assignedSites: self.assignedSites,
                        unAssignedSites: unAssignedSitesKeys
                    });
                })
                .catch(function (error) {
                    console.error(error);
                    eventService.sendEvent(EventTypes.ALERT_WARNING, 'Something goes wrong');
                });
        }

        function parse() {
            self.assignedSites = self.selectedSites.filter(function(site) {
                var isAssigned = true;

                for(var i = 0; i < self.currentSites.length; i++) {
                    var item = self.currentSites[i];
                    if(item['id'] == site['SiteId']) {
                        isAssigned = false;
                        break;
                    }
                }

                return isAssigned;
            });


            self.unAssignedSites = self.currentSites.filter(function(site) {
                var isDeleted = true;

                for(var i = 0; i < self.selectedSites.length; i++) {
                    var item = self.selectedSites[i];
                    if(item['SiteId'] == site['id']) {
                        isDeleted = false;
                        break;
                    }
                }

                return isDeleted;
            });

            self.unAssignedSites = self.unAssignedSites.map(function(site) {
                return {
                    SiteId: site['id'],
                    SiteName: site['name']
                };
            });
        }
    }
})();