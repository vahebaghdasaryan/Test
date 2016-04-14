(function() {
    'use strict';

    angular
        .module('implHit.common')
        .filter('toTrusted', toTrusted);

    toTrusted.$inject = ['$sce'];

    function toTrusted($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }
})();