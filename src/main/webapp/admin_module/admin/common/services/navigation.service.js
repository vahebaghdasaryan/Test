(function() {
    'use strict';

    angular.module('implHit.common')
        .factory('navigationService', navigationService);

    navigationService.$inject = ['$route', '$location', 'Path', 'Page'];

    function navigationService($route, $location, Path, Page) {
        var pageNameToPathMap = initPageToPathMap();
        var targetPage;

        return {
            navigateTo: navigateTo,
            getPageFullPath: getPageFullPath,
            isCurrentPage: isCurrentPage,

            hasTargetPage: hasTargetPage,
            setTargetPage: setTargetPage,
            navigateToTargetPage: navigateToTargetPage
        };

        function initPageToPathMap() {
            var routes = $route.routes;
            var pageNameToPathMap = {};
            Object.keys(routes).forEach(function(url) {
                if (routes[url].name) {
                    pageNameToPathMap[routes[url].name] = url;
                }
            });

            return pageNameToPathMap;
        }

        function navigateTo(pageName, searchObj) {
            $location.path(pageNameToPathMap[pageName]);
            if (angular.isObject(searchObj) && !angular.isArray(searchObj)) {
                $location.search(searchObj);
            }
        }

        function getPageFullPath(pageName, routeParamsObj) {
            var fullPath = Path.APP_CONTEXT_PATH + pageNameToPathMap[pageName];
            if (routeParamsObj) {
                Object.keys(routeParamsObj).forEach(function(key) {
                    fullPath = fullPath.replace(key, routeParamsObj[key]);
                });
            }
            return fullPath;
        }

        function isCurrentPage(pageName) {
            return $route.current.name === pageName;
        }

        function hasTargetPage() {
            return !!targetPage;
        }

        function setTargetPage() {
            var path = $location.path();
            if(path.indexOf(Page.LOGIN) == -1 && path.indexOf(Page.WELCOME) == -1) {
                targetPage = path;
            }
        }

        function navigateToTargetPage() {
            $location.path(targetPage);
            resetTargetPage();
        }

        function resetTargetPage() {
            targetPage = undefined;
        }
    }

})();