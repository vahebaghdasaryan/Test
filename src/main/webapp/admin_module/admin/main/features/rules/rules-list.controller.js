(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('RulesListController', RulesListController);

    RulesListController.$inject = ['$scope', '$q', '$uibModal', 'roleService',
        'ruleService', 'siteService', 'divisionService', 'eventService', 'EventTypes'];

    function RulesListController($scope, $q, $uibModal, roleService, ruleService, siteService,
                                 divisionService, eventService, EventTypes) {
        var self = this;

        self.roles = null;
        self.rules = null;
        self.sites = null;
        self.divisions = null;

        self.filter = {};
        self.selectedRules = [];

        self.openNewRuleDialog = openNewRuleDialog;
        self.openApplyRuleDialog = openApplyRuleDialog;
        self.openDeleteRuleDialog = openDeleteRuleDialog;

        self.comparator = comparator;

        init();

        function init() {
            eventService.sendEvent(EventTypes.PAGE_LOADING);

            ruleService.getRules()
                .then(function(response) {
                    self.rules = response.data['rules'];
                })
                .finally(function() {
                    eventService.sendEvent(EventTypes.PAGE_LOADED);
                });



            var getRoles = roleService.getRoles();
            var getSites = siteService.getSites();
            var getDivisions = divisionService.getDivisions();

            $q.all([getRoles, getSites, getDivisions])
                .then(function (results) {
                    self.roles = results[0].data.roles;
                    self.sites = results[1].data['Sites'];
                    self.divisions = results[2].data.specialities;

                })
                .finally(function() {
                    eventService.sendEvent(EventTypes.PAGE_LOADED);
                });
        }

        function openNewRuleDialog(event){
            event.preventDefault();

            var dc = $scope.$new();
            dc.divisions = self.divisions;
            dc.roles = self.roles;
            dc.sites = self.sites;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/rules/dialogs/new-rule/new-rule.html',
                controller: 'NewRuleController',
                controllerAs: 'dc',
                scope: dc
            });

            dialog.result
                .then(function(rule) {
                    self.rules.push(rule);
                })
                .catch(function(error) {
                    console.log(error);
                });
        }

        function openApplyRuleDialog(event, selectedRule) {
            event.preventDefault();

            var dc = $scope.$new();
            dc.rule = selectedRule;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/rules/dialogs/apply-rule/apply-rule.html',
                controller: 'ApplyRuleController',
                controllerAs: 'dc',
                scope: dc
            });

            dialog.result
                .then(function() {
                    console.log('apply successfully')
                })
                .catch(function(error) {
                    console.log(error);
                });
        }

        function openDeleteRuleDialog(event, selectedRule){
            event.preventDefault();

            var newScope = $scope.$new();
            newScope.rule = selectedRule;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/rules/dialogs/delete-rule/delete-rule.html',
                controller: 'DeleteRuleController',
                controllerAs: 'dc',
                scope: newScope
            });

            dialog.result.then(function () {
                self.rules = self.rules.filter(function(rule) {
                    return rule.id != selectedRule.id;
                });
            }, function () {
                console.log("can't delete rule with id = " + selectedRule.id);
            });
        }

        function comparator(rule) {
            return searchCriteria(rule);
        }

        function searchCriteria(rule) {
            var searchQuery = self.filter.search;

            if (searchQuery && searchQuery.length > 0) {
                searchQuery = searchQuery.toLowerCase();

                var contains = true;
                var tokens = searchQuery.split(' ');

                var ruleName = rule.title.toLowerCase();

                for (var i = 0; i < tokens.length; i++) {
                    var token = tokens[i];
                    contains = (ruleName.indexOf(token) != -1);
                }

                return contains;
            }

            return true;
        }
    }
})();