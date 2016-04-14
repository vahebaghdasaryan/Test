(function () {
    'use strict';

    angular
        .module('implHit.admin')
        .factory('skillService', skillService);

    skillService.$inject = ['$http', '$httpParamSerializer', 'Path'];

    function skillService($http, $httpParamSerializer, Path) {
        return {
            getSkills: getSkills,
            markCompleted: markCompleted,
            unMarkCompleted: unMarkCompleted
        };

        function getSkills(data) {
            data = data || {
                    "pageNo": 1,
                    "noOfRecords": 20
                };

            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.LIST_SKILLS,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function markCompleted() {
//            return $http({
//                method: 'POST',
//                url:Path.API_ENDPOINT_BASE_URL + '/user/markCompleted',
//                data: {}
//            });
        }

        function unMarkCompleted() {
//            return $http({
//                method: 'POST',
//                url:Path.API_ENDPOINT_BASE_URL + '/user/unMarkCompleted',
//                data: {}
//            });
        }
    }
})();