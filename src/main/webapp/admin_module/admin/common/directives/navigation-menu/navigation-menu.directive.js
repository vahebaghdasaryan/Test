(function() {
    'use strict';

    angular
        .module('implHit.common')
        .directive('navigationMenu', navigationMenu);

    navigationMenu.$inject = ['$route', '$location', 'navigationService', 'authService'];

    function navigationMenu($route, $location, navigationService, authService) {
        return {
            restrict: 'E',
            templateUrl: 'admin/common/directives/navigation-menu/navigation-menu.template.html',
            link: link
        };

        function link(scope, element, attrs) {
            scope.menuItems = initMenuItems();
            scope.activeItem = {
                index: 0
            };

            scope.showNavigationMenu = showNavigationMenu;
            scope.hasAccess = hasAccess;
            scope.menuClass = menuClass;

            function initMenuItems() {
                var menu = [];
                var routes = $route.routes;

                angular.forEach(routes, function(route, url) {
                    var options = route.menu;
                    if(options) {
                        var item = {
                            title: options.title || route.name,
                            icon: options.icon,
                            name: route.name,
                            path: navigationService.getPageFullPath(route.name),
                            requireSuperAdmin: route.requireSuperAdmin
                        };
                        menu.push(item);
                    }
                });

                return menu;
            }

            function showNavigationMenu() {
                return authService.isAuthenticated() && authService.isRegistered();
            }

            function hasAccess(item) {
                if(item.requireSuperAdmin) {
                    var userInfo = authService.getUserInfo();
                    return userInfo['isSuperAdmin'];
                }
                return true;
            }

            function menuClass(page) {
                var current = $location.path().substring(1);
                return page === current ? "active" : "";
            }
        }
    }
})();