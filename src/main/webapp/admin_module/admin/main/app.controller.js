(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('AppController', AppController);

    AppController.$inject = ['$rootScope', '$scope', '$anchorScroll', '$window', 'authService', 'eventService', 'EventTypes', 'Path'];

    function AppController($rootScope, $scope, $anchorScroll, $window, authService, eventService, EventTypes, Path) {
        var self = this;

        self.userInfo = null;
        self.companyInfo = null;
        self.$anchorScroll = $anchorScroll;

        $rootScope.Path = Path;

        self.isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        self.isTouchDevice = function isTouchDevice() {
            return (('ontouchstart' in window)
            || (navigator.MaxTouchPoints > 0)
            || (navigator.msMaxTouchPoints > 0));
        }();

        self.isSystemAdmin = isSystemAdmin;
        self.isSiteAdmin = isSiteAdmin;

        self.alwaysShowMenu = true;
        self.isMenuOpen = true;

        init();

        function init() {
            var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            self.alwaysShowMenu = (width > 1280);
            self.isMenuOpen = self.alwaysShowMenu;

            authService.getUserInfo()
                .then(function (results) {
                    self.userInfo = results.data.userInfo;
                    self.companyInfo = results.data.companyInfo;

                    self.signed = true;
                    registerEventListeners();
                })
                .catch(function(error) {

                });
        }

        function isSystemAdmin() {
            return self.userInfo['accessLevel'] == 'System Administrator';
        }

        function isSiteAdmin() {
            return self.userInfo['accessLevel'] == 'Site Administrator';
        }

        function registerEventListeners() {
            $scope.$on(EventTypes.GENERAL_ERROR, generalErrorHandler);
            $scope.$on('$routeChangeStart', routeChangeStartHandler);
            $scope.$on('$routeChangeError', routeChangeErrorHandler);

            angular.element($window).bind('resize', onResize);
        }

        function onResize() {
            $scope.$applyAsync(function() {
                var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                self.alwaysShowMenu = (width > 1280);
                self.isMenuOpen = self.alwaysShowMenu;
            });
        }

        function generalErrorHandler(event) {
            console.error('general error');
        }

        function routeChangeStartHandler(event, next, current) {
            document.title = next.title;
            eventService.sendEvent(EventTypes.PAGE_LOADING);
        }

        function routeChangeErrorHandler(event, next, current) {
            eventService.sendEvent(EventTypes.PAGE_LOADED);
        }
    }
})();