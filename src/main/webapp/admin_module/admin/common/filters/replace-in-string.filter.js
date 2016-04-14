/**
 * Performs character replacement in string.
 */

(function () {
    'use strict';

    angular
        .module('implHit.common')
        .filter('replaceInString', replaceInString);

    replaceInString.$inject = [];

    function replaceInString() {
        return function(str, regexp, regexpFlags, replaceWithStr) {
            if (angular.isString(str) && angular.isString(regexp) && angular.isString(regexpFlags) && angular.isString(replaceWithStr)) {
                return str.replace(new RegExp(regexp, regexpFlags), replaceWithStr);
            } else {
                return str;
            }
        }
    }
})();