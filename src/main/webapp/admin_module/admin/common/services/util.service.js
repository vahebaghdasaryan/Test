(function() {
    'use strict';

    angular.module('implHit.common')
        .factory('utilService', utilService);

    utilService.$inject = ['$http', 'Path'];

    function utilService($http, Path) {
        return {
            listToMap: listToMap,

            fetchPropertyArray: fetchPropertyArray
        };

        function listToMap(list, key) {
            var map = {};

            var length = list ? list.length : 0;
            for(var i = 0 ; i < length; i++) {
                map[list[i][key]] = list[i];
            }

            return map;
        }

        function fetchPropertyArray(items, property) {
            return items.map(function(item) {
                return item[property];
            });
        }
    }
})();