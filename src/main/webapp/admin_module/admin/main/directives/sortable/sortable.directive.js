/**
 * Usage:
 *
 *      <table
 *          sortable="true"
 *          sort-column="vc.filter.sortColumn"
 *          sort-order="vc.filter.sortOrder"
 *          sort-callback="vc.applyFilter()">
 *        ...
 *        <th predicate="site">Site</th>
 *        ...
 *     </table>
 */
(function() {
    'use strict';

    angular
        .module('implHit.admin')
        .directive('sortable', sortable);

    sortable.$inject = ['$compile', '$timeout'];

    function sortable($compile, $timeout) {
        return {
            restrict: 'A',
            link: link,
            scope: {
                sortColumn: '=',
                sortOrder: '=',
                sortCallback: '&?'
            }
        };

        function link(scope, element, attrs) {
            scope.sort = sort;

            var header = element.find('th');
            for(var i = 0 ; i < header.length; i++) {
                var th = header[i];

                if(th.hasAttribute('predicate')) {
                    var predicate = th.getAttribute('predicate');
                    var title = th.innerHTML;
                    var template = '<a href="#" ng-click="sort($event,\''+predicate+'\')">' + title + '<span class="caret {{sortOrder}}" ng-show="sortColumn === \''+predicate+'\'"></span></a>';

                    angular.element(th).html('').append($compile(template)(scope));
                }
            }

            function sort(event, predicate) {
                event.preventDefault();

                scope.sortColumn = predicate;
                scope.sortOrder = scope.sortOrder == 'desc' ? 'asc' : 'desc';

                if(scope.sortCallback) {
                    $timeout(function() {  // callback invoke in next digest cycle, when sortColumn and sortOrder is already synched.
                        scope.sortCallback();
                    });
                }

            }
        }
    }
})();