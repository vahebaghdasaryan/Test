(function () {
    'use strict';

    angular
        .module('implHit.admin')
        .factory('roleService', roleService);

    roleService.$inject = ['$http', '$httpParamSerializer', 'Path', 'domain'];

    function roleService($http, $httpParamSerializer, Path, domain) {
        return {
            getRoles: getRoles,
            assignRoles: assignRoles,
            unAssignRoles: unAssignRoles,

            fetchRoles: fetchRoles,
            fetchCommonRoles: fetchCommonRoles
        };

        function getRoles() {
            var data = {
                "domain": domain
            };

            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.LIST_ROLES,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function assignRoles(userEmailList, roleList, sendEmail, emailTo) {
            var data = {
                "userEmailList": userEmailList,
                "roleList": roleList
            };

            if(sendEmail)
                data.emailTo = emailTo;

            return $http({
                method: 'POST',
                url:Path.API_ENDPOINT_BASE_URL + Path.ASSIGN_ROLE,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function unAssignRoles(userEmailList, roleList, sendEmail, emailTo) {
            var data = {
                "userEmailList": userEmailList,
                "roleList": roleList
            };

            if(sendEmail)
                data.emailTo = emailTo;

            return $http({
                method: 'POST',
                url:Path.API_ENDPOINT_BASE_URL + Path.UN_ASSIGN_ROLE,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }


        function fetchRoles(users) {
            var roles = [];
            for(var i = 0 ; i < users.length; i++) {
                var userRoles = users[i]['Roles'].split(',');
                userRoles = userRoles.map(function(item) {return item.trim();});
                for(var j = 0 ; j < userRoles.length; j++) {
                    if(roles.indexOf(userRoles[j]) == -1) {
                        roles.push(userRoles[j]);
                    }
                }
            }
            return roles;
        }

        function fetchCommonRoles(users) {
            var roles = [];

            if(users.length > 0) {
                roles = roles.concat(users[0]['Roles'].split(','));
                roles = roles.map(function(item) {return item.trim();});
            }

            roles = roles.filter(function(role) {
                return role != '';
            });

            for(var i = 1; i < users.length; i++) {
                roles = roles.filter(function(role) {
                    return users[i]['Roles'].indexOf(role) != -1;
                });
            }

            return roles;
        }
    }
})();