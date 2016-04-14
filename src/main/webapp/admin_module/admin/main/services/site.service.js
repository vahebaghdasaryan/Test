(function () {
    'use strict';

    angular
        .module('implHit.admin')
        .factory('siteService', siteService);

    siteService.$inject = ['$http', '$httpParamSerializer', 'Path', 'domain'];

    function siteService($http, $httpParamSerializer, Path, domain) {
        return {
            getSites: getSites,
            addSite: addSite,
            assignSites: assignSites,
            unAssignSites: unAssignSites,

            fetchSites: fetchSites,
            fetchCommonSites: fetchCommonSites
        };

        function getSites() {
            var data = {
                "domain": domain
            };

            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.LIST_SITES,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function addSite(data) {
            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.ADD_SITE,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function assignSites(userEmailList, siteIdList, sendEmail, emailTo) {
            var data = {
                "userEmailList": userEmailList,
                "siteIdList": siteIdList
            };

            if(sendEmail)
                data.emailTo = emailTo;

            return $http({
                method: 'POST',
                url:Path.API_ENDPOINT_BASE_URL + Path.ASSIGN_SITE,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function unAssignSites(userEmailList, siteIdList, sendEmail, emailTo) {
            var data = {
                "userEmailList": userEmailList,
                "siteIdList": siteIdList
            };

            if(sendEmail)
                data.emailTo = emailTo;

            return $http({
                method: 'POST',
                url:Path.API_ENDPOINT_BASE_URL + Path.UN_ASSIGN_SITE,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function fetchSites(users) {
            var sites = [];
            for(var i = 0 ; i < users.length; i++) {
                var userSites = users[i]['Sites'].split(',') || [];
                for(var j = 0 ; j < userSites.length; j++) {
                    if(sites.indexOf(userSites[j]) == -1) {
                        sites.push(userSites[j]);
                    }
                }
            }
            return sites;
        }

        function fetchCommonSites(users) {
            var sites = [];

            if(users.length > 0) {
                sites = sites.concat(users[0]['Sites']);
            }

            for(var i = 1; i < users.length; i++) {
                var user = users[i];
                var userSites = user['Sites'];

                sites = sites.filter(function(site) {
                    var contains = false;
                    for(var j = 0 ; j < userSites.length; j++) {
                        var group = userSites[j];
                        if(site.id == group.id) {
                            contains = true;
                        }
                    }
                    return contains;
                });
            }

            return sites;
        }
    }
})();