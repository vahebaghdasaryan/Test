(function () {
    'use strict';

    angular
        .module('implHit.admin')
        .config(configure);

    configure.$inject = ['$locationProvider', '$httpProvider', 'tagsInputConfigProvider', '$uibTooltipProvider', '$provide'];

    function configure($locationProvider, $httpProvider, tagsInputConfigProvider, $uibTooltipProvider, $provide) {

        //$locationProvider.html5Mode(true); //TODO:switched to "hash mode" to avoid url rewriting filter requirement for now

        $httpProvider.interceptors.push('customHttpInterceptor');

        $uibTooltipProvider.setTriggers({'mouseenter': 'click mouseleave'});
        $uibTooltipProvider.options({placement: 'left',appendToBody: true});

        tagsInputConfigProvider.setDefaults('tagsInput', {
            replaceSpacesWithDashes: false
        });

        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate'];

    function extendExceptionHandler($delegate) {
        return function(exception, cause) {
            $delegate(exception, cause);

            console.log(exception.message);
        };
    }
})();

