/**
 * Accepts an array and string separator and returns array items as string concatenated by provided separator.
 */

(function () {
    'use strict';

    angular
        .module('implHit.common')
        .filter('concatenate', concatenate);

    concatenate.$inject = [];

    function concatenate() {
        return function(array, separator) {
            if (angular.isArray(array) && angular.isString(separator)) {
                var resultStr = '';

                for (var i = 0; i < array.length; i++) {
                    resultStr += array[i] + separator;
                }

                return resultStr.substring(0, resultStr.length - separator.length);
            } else {
                return array;
            }
        }
    }
})();