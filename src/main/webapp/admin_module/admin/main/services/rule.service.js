(function () {
    'use strict';

    angular
        .module('implHit.admin')
        .factory('ruleService', ruleService);

    ruleService.$inject = ['$http', '$httpParamSerializer', 'Path', 'domain'];

    function ruleService($http, $httpParamSerializer, Path, domain) {
        return {
            getRules: getRules,
            addRule: addRule,
            deleteRule: deleteRule,
            applyRule: applyRule
        };

        function getRules() {
            var data = {
                "domain": domain
            };

            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.LIST_RULES,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function addRule(data){
            data.domain = domain;

            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.ADD_RULE,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function deleteRule(ruleId){
            var data = {
                domain: domain,
                ruleId: ruleId
            };

            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.DELETE_RULE,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function applyRule(ruleId){
            var data = {
                domain: domain,
                ruleId: ruleId
            };

            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.APPLY_RULE,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }
    }
})();