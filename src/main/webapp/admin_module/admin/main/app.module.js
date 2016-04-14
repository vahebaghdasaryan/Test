(function() {
    'use strict';

    angular.module('implHit.admin', [
        'implHit.common',

        'ui.bootstrap',
        'ngRoute',
        'ngAnimate',
        'ngSanitize',
        'ngTagsInput',
        'ui.validate',
        'ngMessages'
    ]).run(run);

    run.$inject = [];

    function run() {
        FastClick.attach(document.body);
    }

})();