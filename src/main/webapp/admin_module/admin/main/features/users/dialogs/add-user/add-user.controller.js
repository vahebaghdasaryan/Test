(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('AddUserController', AddUserController);

    AddUserController.$inject = ['$q', '$scope', '$uibModalInstance', 'userService', 'siteService', 'eventService', 'EventTypes'];

    function AddUserController($q, $scope, $uibModalInstance, userService, siteService, eventService, EventTypes) {
        var self = this;

        self.roles = $scope.roles;
        self.sites = $scope.sites;
        self.divisions = $scope.divisions;

        self.user = {};

        self.userRoles = [];
        self.userSites = [];
        self.userDivisions = [];

        self.rolesFilter = rolesFilter;
        self.sitesFilter = sitesFilter;
        self.divisionsFilter = divisionsFilter;

        self.cancel = cancel;
        self.submit = submit;

        registerEvents();

        function registerEvents() {
            $scope.$watch('dc.user', function() {
                delete self.unexpectedError;
            }, true);
        }

        function rolesFilter(query) {
            return self.roles.filter(function(item) {
                return item.toLowerCase().indexOf(query.toLowerCase()) != -1;
            });
        }

        function sitesFilter(query) {
            return self.sites.filter(function(item) {
                return item['SiteName'].toLowerCase().indexOf(query.toLowerCase()) != -1;
            });
        }

        function divisionsFilter(query) {
            return self.divisions.filter(function(item) {
                return item.toLowerCase().indexOf(query.toLowerCase()) != -1;
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function submit() {
            var promises = parse();

            $q.all(promises).then(function() {
                self.user.sites = self.userSites.map(function (tag) {
                    return {
                        id: tag['SiteId'],
                        name: tag['SiteName']
                    };
                });
                var sites = [];
                for(var i = 0; i < self.user.sites.length; i++) {
                    sites.push(self.user.sites[i]['name']);
                }
                self.user.siteNames = sites;

                addUser();
            });
        }

        function addUser() {
            userService.addUser(self.user)
                .then(function(result) {

                    if(self.newCreatedRoles.length > 0) {
                        eventService.sendEvent(EventTypes.ALERT_INFO, 'Roles <b>' + self.newCreatedRoles + '</b> was successfully created');
                    }

                    if(self.newCreatedSpecialties.length > 0) {
                        eventService.sendEvent(EventTypes.ALERT_INFO, 'Specialties <b>' + self.newCreatedSpecialties + '</b> was successfully created');
                    }

                    var user = {};

                    user['User Id'] = result.data['User']['UserId'];
                    user['DateAdded'] = result.data['User']['CreationTime'];
                    user['AccessLevel'] = getAccessLevel(self.user.userRole);
                    user['FirstName'] = self.user.firstName;
                    user['LastName'] = self.user.lastName;
                    user['Title'] = self.user.title;
                    user['Sites'] = self.user.sites;
                    user['Roles'] = self.user.roles;
                    user['Division'] = self.user.specialties;
                    user['Email'] = self.user.email;
                    user['isForceResetPassword'] = self.user.isForceResetPassword;
                    user['disablePrerequisites'] = self.user.disablePrerequisites;
                    user['Remaining'] = 0;
                    user['Attempted'] = 0;
                    user['Completed'] = 0;

                    $uibModalInstance.close({
                        user: user,
                        newCreatedRoles: self.newCreatedRolesArray,
                        newCreatedDivisions: self.newCreatedSpecialtiesArray,
                        newCreatedSites: self.newCreatedSites
                    });
                })
                .catch(function (error) {
                    //TODO: classify some error messages.
                    self.unexpectedError = (error.data.reason == "Email Id Already Exists") ? "User with this e-mail address already exists" : error.data.reason;
                    $scope.newUserForm.$submitted = false;
                });
        }

        function getAccessLevel(userRole) {
            return userRole ? (userRole == 0 ? 'User' : (userRole == 1 ? 'Site Admin' : 'System Admin')) : '';
        }

        function parse() {
            // roles
            self.user.roles = self.userRoles.map(function (tag) {
                return tag.text;
            });

            self.newCreatedRolesArray = [];
            self.newCreatedRoles = '';
            var roles = '';
            for(var i = 0; i < self.user.roles.length; i++) {
                var role = self.user.roles[i];
                roles += role + ',';
                if(self.roles.indexOf(role) == -1) {
                    self.newCreatedRoles += role + ',';
                    self.newCreatedRolesArray.push(role);
                    self.roles.push(role);
                }
            }
            self.user.roles = roles.length > 0 ? roles.substring(0, roles.length-1) : roles;

            // specialties
            self.user.specialties = self.userDivisions.map(function (tag) {
                return tag.text;
            });

            self.newCreatedSpecialtiesArray = [];
            self.newCreatedSpecialties = '';
            var specialties = '';
            for(var i = 0; i < self.user.specialties.length; i++) {
                var specialty = self.user.specialties[i];
                specialties += specialty + ',';
                if(self.divisions.indexOf(specialty) == -1) {
                    self.newCreatedSpecialties += specialty + ',';
                    self.newCreatedSpecialtiesArray.push(specialty);
                    self.divisions.push(specialty);
                }
            }
            self.user.specialties = specialties.length > 0 ? specialties.substring(0, specialties.length-1) : specialties;

            // sites
            return processSites();
        }

        function processSites() {
            var promises = [];

            var newSites = self.userSites.filter(function(site) {
                return !site['SiteId'];
            });

            self.newCreatedSites = [];

            if(newSites.length > 0) {
                promises = addNewSites(newSites);
            }

            return promises;
        }

        function addNewSites(sites) {
            var promises = [];
            for(var i = 0; i < sites.length; i++) {
                var site = sites[i];
                promises.push(addSite(site));
            }
            return promises;
        }

        function addSite(site) {
            var deferred = $q.defer();

            siteService.addSite({groupName: site['SiteName']})
                .then(function(response) {
                    response.data = response.data.substring(0, response.data.length - 4);
                    response.data = angular.fromJson(response.data);
                    site['SiteId'] = response.data['Group ID'];

                    self.sites.push(site);
                    self.newCreatedSites.push(site);
                    eventService.sendEvent(EventTypes.ALERT_INFO, 'New site with name <b>' + site['SiteName'] + '</b> was successfully added');

                    deferred.resolve();
                })
                .catch(function (error) {
                    self.unexpectedError = error.data.reason;
                    $scope.newUserForm.$submitted = false;
                });

            return deferred.promise;
        }
    }
})();