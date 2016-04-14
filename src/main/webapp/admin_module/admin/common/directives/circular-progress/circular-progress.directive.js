(function() {
    'use strict';

    angular
        .module('implHit.common')
        .directive('circularProgress', circularProgress);

    circularProgress.$inject = ['$window'];

    function circularProgress($window) {
        return {
            restrict: 'E',
            templateUrl: 'admin/common/directives/circular-progress/circular-progress.template.html',
            link: postLink,
            scope: {
                percent: '=',
                fontSize: '=?',
                width: '=?',
                height: '=?',
                primaryColor: '=?',
                secondColor: '=?',
                backgroundColor: '=?'
            }
        };

        function postLink(scope, element, attrs) {
            var primaryColor = scope.primaryColor || '#76bbad';
            var secondColor = scope.secondColor || '#ecf0f5';
            var backgroundColor = scope.backgroundColor || rgb2hex(element[0].style.backgroundColor) || '#fff';
            var width = scope.width || parseInt($window.getComputedStyle(element[0]).width);
            var height = scope.height || parseInt($window.getComputedStyle(element[0]).height);
            var percent = scope.percent || 0;
            var fontSize = scope.fontSize || '1em';

            var canvas = element.children()[0];
            var context = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var R = canvas.width / 2;
            var r = R-R/3;

            context.beginPath();
            context.arc(centerX, centerY, R, 0, 2 * Math.PI, true);
            context.fillStyle = secondColor;
            context.fill();
            context.closePath();

            context.beginPath();
            context.arc(centerX, centerY, R, -Math.PI/2, -Math.PI/2 + 2* Math.PI /100 * parseFloat(percent), false);
            context.lineTo(centerX, centerY);
            context.lineTo(centerX, centerY-R);
            context.fillStyle = primaryColor;
            context.fill();
            context.closePath();

            context.beginPath();
            context.arc(centerX, centerY, r, 0, 2 * Math.PI, false);
            context.fillStyle = backgroundColor;
            context.fill();
            context.closePath();

            context.fillStyle = primaryColor;
            context.font = 'normal ' + fontSize + ' Segoe UI';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(percent + '%', centerX, centerY);
        }

        function rgb2hex(rgb){
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
        }
    }
})();