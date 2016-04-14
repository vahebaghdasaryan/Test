(function() {
    'use strict';

    angular.module('implHit.admin')
        .controller('DomainSettingsController', DomainSettingsController);

    DomainSettingsController.$inject = ['$scope', '$q', '$uibModal', 'domainService', 'eventService', 'EventTypes'];

    function DomainSettingsController($scope, $q, $uibModal, domainService, eventService, EventTypes) {
        var self = this;

        self.ssoConfig = null;
        self.domainPreferences = null;
        self.loginMessage = null;

        self.openSetupSSODialog = openSetupSSODialog;
        self.openLoginMessageDialog = openLoginMessageDialog;
        self.openChangePasswordDialog = openChangePasswordDialog;

        init();

        function init() {
            var domainId = 2569002;

            var getSSOConfig = domainService.getSSOConfig(domainId);
            var getLoginMessage = domainService.getLoginMessage(domainId);
            var getDomainPreferences = domainService.getDomainPreferences();

            $q.all([getSSOConfig, getLoginMessage, getDomainPreferences])
                .then(function (results) {
                    self.ssoConfig = results[0];
                    self.loginMessage = results[1];
                    self.domainPreferences = results[2];
                })
                .finally(function() {
                    eventService.sendEvent(EventTypes.PAGE_LOADED);
                });
        }

        function openSetupSSODialog(event) {
            event.preventDefault();

            var dc = $scope.$new();
            dc.ssoConfig = self.ssoConfig;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/domain-settings/dialogs/setup-sso/setup-sso.html',
                controller: 'SetupSSOController',
                controllerAs: 'dc',
                scope: dc
            });

            dialog.result
                .then(function(ssoConfig) {
                    self.ssoConfig = ssoConfig;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }

        function openLoginMessageDialog(event) {
            event.preventDefault();

            var dc = $scope.$new();
            dc.message = self.loginMessage;

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/domain-settings/dialogs/update-login-message/update-login-message.html',
                controller: 'UpdateLoginMessageController',
                controllerAs: 'dc',
                scope: dc
            });

            dialog.result
                .then(function(loginMessage) {
                    self.loginMessage = loginMessage;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }

        function openChangePasswordDialog(event) {
            event.preventDefault();

            var dialog = $uibModal.open({
                templateUrl: 'admin/main/features/domain-settings/dialogs/change-password/change-password.html',
                controller: 'ChangePasswordController',
                controllerAs: 'dc'
            });

            dialog.result
                .then(function() {
                    console.log('password is successfully changed.');
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
})();