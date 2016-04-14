(function () {
    'use strict';

    angular.module('implHit.common')
        .constant('EventTypes', {
            LOGIN_SUCCESS: 'loginSuccess',
            LOGOUT_SUCCESS: 'logoutSuccess',
            LOGIN_ERROR: 'loginError',
            LOGOUT_ERROR: 'logoutError',

            USER_REGISTERED: 'userRegistered',

            ACCESS_DENIED: 'accessDenied',
            SESSION_EXPIRED: 'sessionExpired',
            NOT_AUTHENTICATED: 'notAuthenticated',

            PAGE_LOADING: 'pageLoading',
            PAGE_LOADED: 'pageLoaded',

            GENERAL_ERROR: 'generalError',

            ALERT_INFO: 'alertInfo',
            ALERT_WARNING: 'alertWarning'
        })
        .constant('ResponseCodes', {
            RESPONSE_CODE_SUCCESS: 0,
            RESPONSE_CODE_INVALID_INPUT: 40,
            RESPONSE_CODE_GENERAL_ERROR: 1,
            RESPONSE_CODE_ACCESS_DENIED: 2,
            RESPONSE_CODE_TOO_MANY_MATCHES: 41,
            RESPONSE_CODE_REQUEST_IS_OUT_OF_DATE: 42
        })
        .constant('DATE_FORMAT', 'MMM DD, YYYY')
        .constant('TIME_FORMAT', 'hh:mm A')
        .config(['$anchorScrollProvider', function ($anchorScrollProvider) {
            $anchorScrollProvider.disableAutoScrolling();
        }])
        .config(['uibDatepickerConfig', 'uibDatepickerPopupConfig',
            function (uibDatepickerConfig, uibDatepickerPopupConfig) {
                uibDatepickerConfig.maxMode = 'day';
                uibDatepickerPopupConfig.datepickerPopup = 'MMM dd, yyyy';
                uibDatepickerPopupConfig.closeText = 'Close';
            }]);
})();