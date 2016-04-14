(function () {
    'use strict';

    angular
        .module('implHit.admin')
        .factory('divisionService', divisionService);

    divisionService.$inject = ['$http', '$httpParamSerializer', 'Path', 'domain'];

    function divisionService($http, $httpParamSerializer, Path, domain) {
        return {
            getDivisions: getDivisions,
            assignDivisions: assignDivisions,
            unAssignDivisions: unAssignDivisions,

            fetchDivisions: fetchDivisions,
            fetchCommonDivisions: fetchCommonDivisions
        };

        function getDivisions() {
            var data = {
                "domain": domain
            };

            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.LIST_DIVISIONS,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function assignDivisions(userEmailList, divisionList, sendEmail, emailTo) {
            var data = {
                "userEmailList": userEmailList,
                "divisionList": divisionList
            };

            if(sendEmail)
                data.emailTo = emailTo;

            return $http({
                method: 'POST',
                url:Path.API_ENDPOINT_BASE_URL + Path.ASSIGN_DIVISION,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function unAssignDivisions(userEmailList, divisionList, sendEmail, emailTo) {
            var data = {
                "userEmailList": userEmailList,
                "divisionList": divisionList
            };

            if(sendEmail)
                data.emailTo = emailTo;

            return $http({
                method: 'POST',
                url:Path.API_ENDPOINT_BASE_URL + Path.UN_ASSIGN_DIVISION,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function fetchDivisions(users) {
            var divisions = [];
            for(var i = 0 ; i < users.length; i++) {
                var userDivisions = users[i]['Division'].split(',');
                userDivisions = userDivisions.map(function(item) {return item.trim();});
                for(var j = 0 ; j < userDivisions.length; j++) {
                    if(divisions.indexOf(userDivisions[j]) == -1) {
                        divisions.push(userDivisions[j]);
                    }
                }
            }
            return divisions;
        }

        function fetchCommonDivisions(users) {
            var divisions = [];

            if(users.length > 0) {
                divisions = divisions.concat(users[0]['Division'].split(','));
                divisions = divisions.map(function(item) {return item.trim();});
            }

            divisions = divisions.filter(function(division) {
                return division != '';
            });

            for(var i = 1; i < users.length; i++) {
                divisions = divisions.filter(function(division) {
                    return users[i]['Division'].indexOf(division) != -1;
                });
            }

            return divisions;
        }
    }
})();