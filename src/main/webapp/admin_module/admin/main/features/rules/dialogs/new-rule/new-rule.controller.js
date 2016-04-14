(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('NewRuleController', NewRuleController);

    NewRuleController.$inject = ['$scope', '$uibModalInstance', 'ruleService', 'eventService', 'EventTypes'];

    function NewRuleController($scope, $uibModalInstance, ruleService, eventService, EventTypes) {
        var self = this;

        self.allDivisions = $scope.divisions;
        self.allRoles = $scope.roles;
        self.allSites = $scope.sites;

        self.rule = {};

        self.target = 'division';

        self.selectedDivisions = [];
        self.selectedRoles = [];
        self.selectedSites = [];
        self.selectedTargetDivisions = [];
        self.selectedTargetRoles = [];

        self.divisionsFilter = divisionsFilter;
        self.rolesFilter = rolesFilter;
        self.sitesFilter = sitesFilter;

        self.cancel = cancel;
        self.submit = submit;

        function sitesFilter(query) {
            return self.allSites.filter(function(item) {
                return item['SiteName'].toLowerCase().indexOf(query.toLowerCase()) != -1;
            });
        }

        function divisionsFilter(query) {
            return self.allDivisions.filter(function(division) {
                return division.toLowerCase().indexOf(query.toLowerCase()) != -1;
            });
        }

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

            ruleService.addRule(self.rule)
                .then(function(result) {
                    var createdRule = result.data['createdRule'];
                    if(createdRule) {
                        $uibModalInstance.close(createdRule);
                        eventService.sendEvent(EventTypes.ALERT_WARNING, 'New rule was successfully created.');
                    } else {
                        eventService.sendEvent(EventTypes.ALERT_WARNING, 'Something goes wrong');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    eventService.sendEvent(EventTypes.ALERT_WARNING, 'Something goes wrong');
                });
        }

        function parse() {
            self.rule.divisions = self.selectedDivisions.map(function (tag) {
                return tag.text;
            });

            self.rule.roles = self.selectedRoles.map(function (tag) {
                return tag.text;
            });

            self.rule.sites = self.selectedSites.map(function(tag) {
                return tag['SiteId'];
            });

            if(self.target == 'division') {
                self.rule.targetDivision = self.selectedTargetDivisions[0]['text'];
                delete self.rule.targetRole;
            } else if(self.target == 'role') {
                self.rule.targetRole = self.selectedTargetRoles[0]['text'];
                delete self.rule.targetDivision;
            }
        }
    }
})();