(function() {
    'use strict';

    /* CONFIG */
    angular.module('implHit.common')
        .constant('SelectEvent', {
            ADD_ITEM: 'addItem',
            DEL_ITEM: 'delItem',
            ADD_ALL: 'addAll',
            DEL_ALL: 'delAll',
            REGISTER: 'registerItem',
            UNREGISTER: 'unregisterItem'
        });

    /* SELECT-ALL */
    angular
        .module('implHit.common')
        .directive('selectAll', selectAll);

    selectAll.$inject = ['$rootScope', 'SelectEvent'];

    function selectAll($rootScope, SelectEvent) {
        return {
            restrict: 'E',
            require: 'ngModel',
            template: '<input type="checkbox" ng-model="checked" ng-click="toggle($event)"/><label></label>',
            link: link
        };

        function link(scope, element, attrs, ngModelCtrl) {
            scope.toggle = toggle;
            scope.checked = false;
            scope.values = [];
            scope.items = [];

            scope.$on(SelectEvent.ADD_ITEM, addItemHandler);
            scope.$on(SelectEvent.DEL_ITEM, delItemHandler);
            scope.$on(SelectEvent.REGISTER, registerHandler);
            scope.$on(SelectEvent.UNREGISTER, unregisterHandler);

            function toggle(event) {
                var checked = event.target.checked;
                var selectEvent = checked ? SelectEvent.ADD_ALL : SelectEvent.DEL_ALL;

                scope.checked = checked;
                scope.values = [];
                $rootScope.$broadcast(selectEvent, scope.value);
            }

            function addItemHandler(event, value) {
                addItem(value);
            }

            function delItemHandler(event, value) {
                delItem(value);
            }

            function registerHandler(event, item) {
                register(item);
            }

            function unregisterHandler(event, item, value) {
                unregister(item);
                delItem(value);
            }

            function addItem(value) {
                scope.values.push(value);
                updateNgModel();
            }

            function delItem(value) {
                var index = scope.values.indexOf(value);
                if(index != -1) {
                    scope.values.splice(index, 1);
                }
                updateNgModel();
            }

            function register(item) {
                scope.items.push(item);
            }

            function unregister(item) {
                var index = scope.items.indexOf(item);
                if(index != -1) {
                    scope.items.splice(index, 1);
                }
            }

            function updateNgModel() {
                if(scope.items.length == 0 || scope.values.length == 0) {
                    scope.checked = false;
                }
                else if(scope.items.length == scope.values.length) {
                    scope.checked = true;
                }

                ngModelCtrl.$setViewValue(scope.values);
                ngModelCtrl.$commitViewValue(scope.values);
            }
        }
    }

    /* SELECT-ITEM */
    angular
        .module('implHit.common')
        .directive('selectItem', selectItem);

    selectItem.$inject = ['$rootScope', 'SelectEvent'];

    function selectItem($rootScope, SelectEvent) {
        return {
            restrict: 'E',
            replace: true,
            template: '<input type="checkbox" ng-click="select($event)"/>',
            scope: {
                value: '='
            },
            link: link
        };

        function link(scope, element, attrs) {
            scope.select = select;

            scope.$on(SelectEvent.ADD_ALL, addSelf);
            scope.$on(SelectEvent.DEL_ALL, delSelf);

            scope.$on('$destroy', unregister);
            register();


            function register() {
                $rootScope.$broadcast(SelectEvent.REGISTER, element);
            }

            function unregister() {
                $rootScope.$broadcast(SelectEvent.UNREGISTER, element, scope.value);
            }

            function select(event) {
                var checked = event.target.checked;
                var selectEvent = checked ? SelectEvent.ADD_ITEM : SelectEvent.DEL_ITEM;

                $rootScope.$broadcast(selectEvent, scope.value);
            }

            function addSelf(event, value) {
                element[0].checked = true;
                $rootScope.$broadcast(SelectEvent.ADD_ITEM, scope.value);
            }

            function delSelf(event, value) {
                element[0].checked = false;
                $rootScope.$broadcast(SelectEvent.DEL_ITEM, scope.value);
            }
        }
    }
})();