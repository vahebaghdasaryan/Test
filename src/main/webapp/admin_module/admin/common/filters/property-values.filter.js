/*
* Accepts an array of objects as first argument and a property key as second argument. Iterates over provided array,
* extracts the value for given key from each item(if key exists for item), puts it in array if array does not already
* contain that value and returns resulting array.
*/

(function () {
    'use strict';

    angular
        .module('implHit.common')
        .filter('propertyValues', propertyValues);

    propertyValues.$inject = [];

    function propertyValues() {
        return function(objectArray, key) {
            if (angular.isArray(objectArray)) {
                var resultingArray = [];
                for (var i = 0; i < objectArray.length; i++) {
                    var value = objectArray[i][key];
                    if (value && resultingArray.indexOf(value) === -1) {
                        resultingArray.push(value);
                    }
                }
                return resultingArray;
            } else {
                return objectArray;
            }
        }
    }
})();