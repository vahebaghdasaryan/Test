(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('SkillsListController', SkillsListController);

    SkillsListController.$inject = ['$scope', '$q', '$uibModal', '$filter',
        'skillService', 'eventService', 'EventTypes'];

    function SkillsListController($scope, $q, $uibModal, $filter, skillService, eventService, EventTypes) {
        var self = this;

        self.skills = null;

        self.filter = {
            "pageNo": 1,
            "noOfRecords": 20
        };
        self.selectedSkills = [];

        self.applyFilter = applyFilter;
        self.resetFilter = resetFilter;

        self.next = next;
        self.prev = prev;

        init();

        function init() {
            eventService.sendEvent(EventTypes.PAGE_LOADING);

            skillService.getSkills()
                .then(function(response) {
                    self.skills = response.data['Skills'];
                    self.skillsTotalCount = response.data['TotalCount'];
                })
                .finally(function() {
                    eventService.sendEvent(EventTypes.PAGE_LOADED);
                });
        }

        // FILTER
        function applyFilter() {
            var data = {
                "pageNo": 1,
                "noOfRecords": 20,
                "searchValues": {}
            };

            if(self.filter.pageNo)      { data['pageNo'] = self.filter.pageNo; }
            if(self.filter.sortOrder)   { data['sortOrder'] = self.filter.sortOrder; }
            if(self.filter.sortColumn)  { data['sortColumn'] = self.filter.sortColumn; }
            if(self.filter.search)      { data.searchValues['search'] = self.filter.search; }
            if(self.filter.category)    { data.searchValues['category'] = self.filter.category; }
            if(self.filter.level)       { data.searchValues['level'] = self.filter.level; }

            if(Object.keys(data.searchValues).length === 0) {
                delete data.searchValues;
            }

            eventService.sendEvent(EventTypes.PAGE_LOADING);

            skillService.getSkills(data)
                .then(function(result) {
                    self.skills = result.data["Skills"];
                    self.skillsTotalCount = result.data['TotalCount'];
                })
                .catch(function(error) {
                    console.log(error);
                })
                .finally(function() {
                    eventService.sendEvent(EventTypes.PAGE_LOADED);
                });
        }

        function resetFilter(event) {
            event.preventDefault();
            self.filter = {
                "pageNo": 1,
                "noOfRecords": 20
            };
            applyFilter();
        }

        function next() {
            self.filter['pageNo'] += 1;
            applyFilter();
        }

        function prev() {
            if(self.filter['pageNo'] > 0) {
                self.filter['pageNo'] -= 1;
                applyFilter();
            }
        }
    }
})();