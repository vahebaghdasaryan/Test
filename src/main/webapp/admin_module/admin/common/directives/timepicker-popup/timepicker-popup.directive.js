/*
    Usage example: <timepicker-popup model="dc.userSelections.completionDate" hour-step="2" minute-step="5" show-meridian="true"
    placeholder="hh:mm" wrapped-input-name="specificTimeScheduleTime" required="true"></timepicker-popup>
    Only 'model' attribute is required.
 */
(function() {
    'use strict';

    angular
        .module('implHit.common')
        .directive('timepickerPopup', timepickerPopup);

    timepickerPopup.$inject = [];

    function timepickerPopup() {
        return {
            restrict: 'AE',
            templateUrl: 'admin/common/directives/timepicker-popup/timepicker-popup.template.html',
            controller: ['$scope', '$filter', controller],
            scope: {
                modelValue: '=?model',
                hourStep: '@',
                minuteStep: '@',
                showMeridian: '=?',
                placeholder: '@',
                wrappedInputName: '@',
                required: '@'
            }
        };

        function controller($scope, $filter) {
            $scope.done = done;

            $scope.timepicker = new Date();

            $scope.$watch('modelValue', updateTimepicker);

            function updateTimepicker(modelValue) {
                if(modelValue) {
                    $scope.timepicker = modelValue;
                    $scope.displayValue = $filter('date')(modelValue, 'shortTime');
                }
            }

            function done(timepicker) {
                $scope.modelValue = timepicker;
                $scope.displayValue = $filter('date')(timepicker, 'shortTime');
            }
        }
    }
})();