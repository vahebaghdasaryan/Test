(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('UsersListController', UsersListController);

    UsersListController.$inject = ['$scope', '$q', '$uibModal', '$filter',
        'userService', 'roleService', 'siteService', 'divisionService', 'eventService', 'EventTypes'];

    function UsersListController($scope, $q, $uibModal, $filter, userService, roleService, siteService,
                                 divisionService, eventService, EventTypes) {
        var self = this;

        self.users = null;
        self.roles = null;
        self.sites = null;
        self.divisions = null;

        self.filter = {
            pageNo: 1,
            sortColumn:'firstName',
            sortOrder: 'asc'
        };
        self.selectedUsers = [];

        self.openAddUserDialog = openAddUserDialog;
        self.openEditUserDialog = openEditUserDialog;
        self.openViewUserDialog = openViewUserDialog;
        self.openDeleteUserDialog = openDeleteUserDialog;
        self.openBulkLoadUsersDialog = openBulkLoadUsersDialog;
        self.openAssignRolesDialog = openAssignRolesDialog;
        self.openAssignDivisionsDialog = openAssignDivisionsDialog;
        self.openAssignSitesDialog = openAssignSitesDialog;
        self.openBulkDeleteUsersDialog = openBulkDeleteUsersDialog;

        self.applyFilter = applyFilter;
        self.resetFilter = resetFilter;

        self.next = next;
        self.prev = prev;

        self.comparator = comparator;

        init();

        function init() {
            eventService.sendEvent(EventTypes.PAGE_LOADING);

            userService.getUsers()
                .then(function(response) {
                    self.users = response.data['Users'];
                    self.usersTotalCount = response.data['TotalCount'];
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
                });
        }

        // DIALOGS
        function openAddUserDialog(event) {
            event.preventDefault();

            var dc = $scope.$new();
            dc.roles = self.roles;
            dc.sites = self.sites;
            dc.divisions = self.divisions;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/users/dialogs/add-user/add-user.html',
                controller: 'AddUserController',
                controllerAs: 'dc',
                scope: dc,
                backdrop: 'static'
            });

            dialog.result
                .then(function(result) {
                    self.users.push(result.user);
                    eventService.sendEvent(EventTypes.ALERT_INFO, 'New user was successfully added');
                });
        }

        function openEditUserDialog(event, index) {
            event.preventDefault();

            var selectedUser = self.users[index];
            var selectedUserIndex = index;

            var dc = $scope.$new();
            dc.user = angular.copy(selectedUser);
            dc.roles = self.roles;
            dc.sites = self.sites;
            dc.divisions = self.divisions;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/users/dialogs/edit-user/edit-user.html',
                controller: 'EditUserController',
                controllerAs: 'dc',
                scope: dc,
                backdrop: 'static'
            });

            dialog.result
                .then(function(result) {
                    self.users[selectedUserIndex] = result.user;
                    eventService.sendEvent(EventTypes.ALERT_INFO, 'User was successfully edited');
                });
        }

        function openViewUserDialog(event, index) {
            event.preventDefault();

            var selectedUser = self.users[index];
            var selectedUserIndex = index;

            var dc = $scope.$new();
            dc.user = angular.copy(selectedUser);

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/users/dialogs/view-user/view-user.html',
                controller: 'ViewUserController',
                controllerAs: 'dc',
                scope: dc,
                backdrop: 'static'
            });
        }

        function openDeleteUserDialog(event, selectedUser) {
            event.preventDefault();

            var newScope = $scope.$new();
            newScope.selectedUser = selectedUser;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/users/dialogs/delete-user/delete-user.html',
                controller: 'DeleteUserController',
                controllerAs: 'dc',
                scope: newScope,
                backdrop: 'static'
            });

            dialog.result
                .then(function (data) {
                    var userId = data.userId;
                    self.users = self.users.filter(function(user) {
                        return user['User Id'] != userId;
                    });
                    eventService.sendEvent(EventTypes.ALERT_INFO, 'User with email address  <b>' + selectedUser['Email'] + '</b> successfully deleted');
                });
        }

        function openAssignRolesDialog(event) {
            event.preventDefault();

            if(self.selectedUsers.length == 0) {
                return;
            }

            var dc = $scope.$new();
            dc.selectedUsers = self.selectedUsers;
            dc.currentRoles = roleService.fetchCommonRoles(self.selectedUsers);
            dc.allRoles = self.roles;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/users/dialogs/assign-roles/assign-roles.html',
                controller: 'AssignRolesController',
                controllerAs: 'dc',
                scope: dc,
                backdrop: 'static'
            });

            dialog.result
                .then(function(data) {
                    var userIdList = data.userIdList;
                    var assignedRoles = data.assignedRoles;
                    var unAssignedRoles = data.unAssignedRoles;

                    self.users = self.users.map(function(user) {
                        if(userIdList.indexOf(user['User Id']) != -1) {

                            var rolesArray = user['Roles'].split(',');
                            rolesArray = rolesArray.map(function(item) {return item.trim();});

                            // Remove from user's roles array unassigned roles.
                            rolesArray = rolesArray.filter(function(role) {
                                return unAssignedRoles.indexOf(role) == -1;
                            });

                            // Add to user's roles array assigned roles.
                            assignedRoles.forEach(function(role) {
                                if(rolesArray.indexOf(role) == -1) {
                                    rolesArray.push(role);
                                }
                            });

                            var rolesString = '';
                            for(var i = 0; i < rolesArray.length; i++) {
                                rolesString += (rolesArray[i] + ',');
                            }

                            user['Roles'] = rolesString.slice(0, -1);
                        }
                        return user;
                    });

                    eventService.sendEvent(EventTypes.ALERT_INFO, 'Roles successfully assigned');
                });
        }

        function openAssignDivisionsDialog(event) {
            event.preventDefault();

            if(self.selectedUsers.length == 0) {
                return;
            }

            var dc = $scope.$new();
            dc.selectedUsers = self.selectedUsers;
            dc.currentDivisions = divisionService.fetchCommonDivisions(self.selectedUsers);
            dc.allDivisions = self.divisions;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/users/dialogs/assign-divisions/assign-divisions.html',
                controller: 'AssignDivisionsController',
                controllerAs: 'dc',
                scope: dc,
                backdrop: 'static'
            });

            dialog.result
                .then(function(data) {
                    var userIdList = data.userIdList;
                    var assignedDivisions = data.assignedDivisions;
                    var unAssignedDivisions = data.unAssignedDivisions;

                    self.users = self.users.map(function(user) {
                        if(userIdList.indexOf(user['User Id']) != -1) {

                            var divisionArray = user['Division'].split(',');
                            divisionArray = divisionArray.map(function(item) {return item.trim();});

                            // Remove from user's specialities array unassigned divisions.
                            divisionArray = divisionArray.filter(function(division) {
                                return unAssignedDivisions.indexOf(division) == -1;
                            });

                            // Add to user's specialities array assigned divisions.
                            assignedDivisions.forEach(function(division) {
                                if(divisionArray.indexOf(division) == -1) {
                                    divisionArray.push(division);
                                }
                            });

                            var divisionString = '';
                            for(var i = 0; i < divisionArray.length; i++) {
                                divisionString += (divisionArray[i] + ',');
                            }

                            user['Division'] = divisionString.slice(0, -1);
                        }
                        return user;
                    });

                    eventService.sendEvent(EventTypes.ALERT_INFO, 'Divisions successfully assigned');
                });
        }

        function openAssignSitesDialog(event) {
            event.preventDefault();

            if(self.selectedUsers.length == 0) {
                return;
            }

            var dc = $scope.$new();
            dc.selectedUsers = self.selectedUsers;
            dc.currentSites = siteService.fetchCommonSites(self.selectedUsers);
            dc.allSites = self.sites;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/users/dialogs/assign-sites/assign-sites.html',
                controller: 'AssignSitesController',
                controllerAs: 'dc',
                scope: dc,
                backdrop: 'static'
            });

            dialog.result
                .then(function(data) {
                    var userIdList = data.userIdList;
                    var assignedSites = data.assignedSites;
                    var unAssignedSitesKeys = data.unAssignedSites;

                    self.users = self.users.map(function(user) {
                        if(userIdList.indexOf(user['User Id']) != -1) {

                            var sitesArray = user['Sites'];

                            // Remove from user's sites array unassigned sites.
                            sitesArray = sitesArray.filter(function(site) {
                                return unAssignedSitesKeys.indexOf(site.id) == -1;
                            });

                            // Add to user's sites array assigned sites.
                            assignedSites.forEach(function(site) {
                                var contains = false;
                                for(var i = 0; i< sitesArray.length; i++) {
                                    if(site['SiteId'] == sitesArray[i]['id']) {
                                        contains = true;
                                        break;
                                    }
                                }
                                if(!contains) {
                                    sitesArray.push({
                                        id: site['SiteId'],
                                        name: site['SiteName']
                                    });
                                }
                            });

                            user['Sites'] = sitesArray;
                        }
                        return user;
                    });

                    eventService.sendEvent(EventTypes.ALERT_INFO, 'Sites successfully assigned');
                });
        }

        function openBulkLoadUsersDialog(event) {
            event.preventDefault();

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/users/dialogs/bulk-upload-users/bulk-upload-users.html',
                controller: 'BulkLoadUsersController',
                controllerAs: 'dc',
                scope: $scope.$new(),
                backdrop: 'static'
            });
        }

        function openBulkDeleteUsersDialog(event) {
            event.preventDefault();

            if(self.selectedUsers.length == 0) {
                return;
            }

            var newScope = $scope.$new();
            newScope.selectedUsers = self.selectedUsers;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/users/dialogs/bulk-delete-users/bulk-delete-users.html',
                controller: 'BulkDeleteUsersController',
                controllerAs: 'dc',
                scope: newScope,
                backdrop: 'static'
            });

            dialog.result
                .then(function (data) {
                    var userIdList = data.userIdList;
                    self.users = self.users.filter(function(user) {
                        return userIdList.indexOf(user['User Id']) == -1;
                    });

                    eventService.sendEvent(EventTypes.ALERT_INFO, 'Selected ' + userIdList.length + ' user(s) successfully deleted');
                });
        }


        // FILTER
        function applyFilter() {
            var data = {
                "pageNo": 1,
                "sortOrder": "asc",
                "sortColumn": "email",
                "noOfRecords": 20,
                "searchValues": {}
            };

            if(self.filter.pageNo)      { data['pageNo'] = self.filter.pageNo; }
            if(self.filter.sortOrder)   { data['sortOrder'] = self.filter.sortOrder; }
            if(self.filter.sortColumn)  { data['sortColumn'] = self.filter.sortColumn; }
            if(self.filter.search)      { data.searchValues['search'] = self.filter.search; }
            if(self.filter.division)    { data.searchValues['divisions'] = self.filter.division; }
            if(self.filter.site)        { data.searchValues['sites'] = self.filter.site; }
            if(self.filter.role)        { data.searchValues['roleTags'] = self.filter.role; }
            if(self.filter.startDate)   { data.searchValues['From'] = $filter('date')(self.filter.startDate, 'MM/dd/yyyy'); }
            if(self.filter.endDate)     { data.searchValues['To'] = $filter('date')(self.filter.endDate, 'MM/dd/yyyy'); }

            if(Object.keys(data.searchValues).length === 0) {
                delete data.searchValues;
            }

            eventService.sendEvent(EventTypes.PAGE_LOADING);

            userService.getUsers(data)
                .then(function(result) {
                    self.users = result.data["Users"];
                    self.usersTotalCount = result.data['TotalCount'];
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
                pageNo: 1,
                sortColumn:'firstName',
                sortOrder: 'asc'
            };
            applyFilter();
        }

        function next() {
            if(20 * self.filter['pageNo'] < self.usersTotalCount) {
                self.filter['pageNo'] += 1;
                applyFilter();
            }
        }

        function prev() {
            if(self.filter['pageNo'] > 1) {
                self.filter['pageNo'] -= 1;
                applyFilter();
            }
        }

        // LOCAL SEARCH FUNCTIONALITY CURRENTLY DISABLED
        function comparator(user) {
            var searchContains = searchCriteria(user);
            var roleContains = roleCriteria(user);
            var divisionContains = divisionCriteria(user);
            var siteContains = siteCriteria(user);
            var periodContains = periodCriteria(user);

            return (searchContains && roleContains && divisionContains && siteContains && periodContains);
        }

        function searchCriteria(user) {
            var searchQuery = self.filter.search;

            if (searchQuery && searchQuery.length > 0) {
                searchQuery = searchQuery.toLowerCase();

                var contains = true;
                var tokens = searchQuery.split(' ');

                var firstName = user['FirstName'].toLowerCase();
                var lastName = user['LastName'].toLowerCase();
                var email = user['Email'].toLowerCase();
                var npi = user['npi'] || '';

                for (var i = 0; i < tokens.length; i++) {
                    var token = tokens[i];
                    contains = (firstName.indexOf(token) != -1 || lastName.indexOf(token) != -1 ||
                    email.indexOf(token) != -1 || npi.indexOf(token) != -1);
                }

                return contains;
            }

            return true;
        }

        function roleCriteria(user) {
            var role = self.filter.role;
            return role ? user['Roles'].indexOf(role) != -1 : true;
        }

        function siteCriteria(user) {
            var site = self.filter.site;
            return site ? user['Sites'].indexOf(site) != -1 : true;
        }

        function divisionCriteria(user) {
            var division = self.filter.division;
            return division ? user['Division'].indexOf(division) != -1 : true;
        }

        function periodCriteria(user) {
            var timestamp = user['DateAdded'];
            var startDate = self.filter.startDate;
            var endDate = self.filter.endDate;

            var contains = true;

            if(startDate) {
                var startTimestamp = new Date(startDate).getTime();
                contains = (timestamp >= startTimestamp);
            }

            if(endDate && contains) {
                //move to end of day, 86400000=1 DAY
                var endTimestamp = new Date(endDate).getTime() + 86400000 - 1;
                contains = (timestamp <= endTimestamp);
            }

            return contains;
        }

    }
})();