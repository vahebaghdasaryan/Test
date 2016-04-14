/**
 * Usage: <input type="file" file-model="vc.myFile" />
 */
(function() {
    'use strict';

    angular
        .module('implHit.admin')
        .directive('fileModel', fileModel);

    fileModel.$inject = [];

    function fileModel() {
        return {
            restrict: 'A',
            link: link,
            scope: {
                fileModel: '='
            }
        };

        function link(scope, element, attrs) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileModel = changeEvent.target.files[0];
                });
            });
        }
    }
})();