(function () {
    'use strict';

    angular.module('implHit.admin')
        .config(configAppRoutes);

    configAppRoutes.$inject = ['$routeProvider', 'Page'];

    function configAppRoutes($routeProvider, Page) {

        $routeProvider
            .when('/users', {
                name: Page.USERS,
                title: 'OptimizeHIT - Users',
                controller: 'UsersListController',
                controllerAs: 'vc',
                templateUrl: 'admin/main/features/users/users-list.html',
                menu: {
                    icon: 'user',
                    title: 'Users'
                },
                resolve: {}
            })
            .when('/skills', {
                name: Page.SKILLS,
                title: 'OptimizeHIT - Skills',
                controller: 'SkillsListController',
                controllerAs: 'vc',
                templateUrl: 'admin/main/features/skills/skills-list.html',
                menu: {
                    icon: 'fa-book',
                    title: 'Skills'
                }
            })
            .when('/reports', {
                name: Page.REPORTS,
                menu: {
                    icon: 'fa-file-text-o',
                    title: 'Reports'
                }
            })
            .when('/groups-management', {
                name: Page.GROUPS_MANAGEMENT,
                title: 'OptimizeHIT - Rules',
                controller: 'RulesListController',
                controllerAs: 'vc',
                templateUrl: 'admin/main/features/rules/rules-list.html',
                menu: {
                    icon: 'fa-tags',
                    title: 'Group Management'
                }
            })
            .when('/domain-settings', {
                name: Page.DOMAIN_SETTINGS,
                title: 'OptimizeHIT - Domain Settings',
                controller: 'DomainSettingsController',
                controllerAs: 'vc',
                templateUrl: 'admin/main/features/domain-settings/domain-settings.html',
                menu: {
                    icon: 'fa-cog',
                    title: 'Domain Settings'
                }
            })
            .otherwise({
                redirectTo: '/users'
            });
    }
})();