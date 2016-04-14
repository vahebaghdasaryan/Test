(function () {
    'use strict';

    angular
        .module('implHit.admin')
        .factory('domainService', domainService);

    domainService.$inject = ['$http', 'Path'];

    function domainService($http, Path) {
        return {
            getDomains: getDomains,

            getSSOConfig: getSSOConfig,
            setupSSO: setupSSO,

            getLoginMessage: getLoginMessage,
            updateLoginMessage: updateLoginMessage,

            getDomainPreferences: getDomainPreferences
        };

        function getDomains() {
            return $http.get(Path.API_ENDPOINT_BASE_URL + '/domains');
        }

        function getSSOConfig(domainId) {
            return {
                certificate: '' +
                    'MIIDMDCCAhigAwIBAgIQGImGUYDipKhAdVp/rYO3nzANBgkqhkiG9w0BAQsFADBU' +
                    'MVIwUAYDVQQDE0lBREZTIFNpZ25pbmcgLSBhY3RpdmVkaXJlY3RvcnkyLWFjdGl2' +
                    'ZWRpcmVjdG9yeS5hZGZzLmltcGxlbWVudGhpdHRlc3QuY29tMB4XDTE1MTEwMjEy' +
                    'MTgwNVoXDTE2MTEwMTEyMTgwNVowVDFSMFAGA1UEAxNJQURGUyBTaWduaW5nIC0g' +
                    'YWN0aXZlZGlyZWN0b3J5Mi1hY3RpdmVkaXJlY3RvcnkuYWRmcy5pbXBsZW1lbnRo' +
                    'aXR0ZXN0LmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALGh4xFR' +
                    '0LxkBNAcqDwjspe7XbZC39lXi22zapHq3QO+bQs0OkuSdTHVZEouKcc1JfIPCuPV' +
                    '+Fdzw2pc0vAHrUfkopRwZDMS9gDqsRIs1hvRzzAP8OzxViPXRV7YQltCQX2x1coN' +
                    'Cqc9Ex4/3986AiqWuvgUAUn1CQNQz0qUc6M2Ztzg9pk4alIEHoxwRB2qnLqtdYF5' +
                    'xPN0MKCJ6LwqxfurRxz4yUAAJrveCRGmkr1a6QuM2/eFkRH5K+oKpt5qZ7ucNhJI' +
                    'cElA1GjiOjVvghO4GG01LlqK3IGQRlb4uyZ2Go1ChZ4MEeZ+JPGta75mvk3ykjKe' +
                    'G5beWZjDVYj9uxMCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAgSj9Ay/4Wb/vJhvB' +
                    '6NVqGzWHEGiFXx0Z6zGAHIyJRe1GXORaR2hDCfA0V8SXZ6aNISRvG6rJYNFT1P/9' +
                    'dz8jx6VaDjf8YN6xaULGLnMLK7HrU4S1QPk68Wsl4USM+ldzxqzt49x9oZHhLamO' +
                    '0wGBPQ8x84TKTu+Hnt2YVj1ppSH8WMblrSiv2zkX4+8xQiWIaaIrLBRCGcOVQlkU' +
                    '+OSsBWxlN7dioGImlaUw2JrzlekfE2AB6BOyPL0wWDhn2dhsN5K794MqdTHeL9L1' +
                    'DsRDMhtA2RfYblNhVOl8Cad7874xjc3Aha3/Rc4T1cpsNvCdyjdMJ543YXN9TjQo' +
                    '0BVhDQ==',
                url: 'https://104.197.45.203/adfs/ls',
                enableSSO: true,
                isAutoSSO: false
            }
        }

        function setupSSO(ssoConfig) {
            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL,
                data: {
                    action: 'setupSSO',
                    certificate: ssoConfig.certificate,
                    url: ssoConfig.url,
                    enableSSO: ssoConfig.enableSSO,
                    isAutoSSO: ssoConfig.isAutoSSO
                }
            });
        }

        function getLoginMessage() {
            return 'Welcome';
        }

        function updateLoginMessage(message) {
            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL,
                data: {
                    action: 'updateLoginMessage',
                    loginMessage: message

                }
            });
        }

        function getDomainPreferences() {
            return {
                userScreenPreferences: {
                    enabled: true,
                    preferences: {
                        useNewUI: true,
                        defaultToFirstCategory: true,
                        showTopRatedSkills: false,
                        showDiagnostics: false,
                        hideGettingStartedGuide: false
                    }
                },
                emailPreferences: {
                    enabled: false,
                    preferences: {
                        forceEnteringOfPreferenceEmail: false,
                        sendReminderEmails: false,
                        sendEmailsOnAssignment: false,
                        sendEmailsOnCompletion: false,
                        sendSkillCampaignEmails: false,
                        enableEmailTemplateForSites: false
                    }
                },
                administrationPreferences: {
                    enabled: true,
                    preferences: {
                        enableAdvancedBulkUploadOptions: false,
                        enableSCORMUpload: false,
                        enablePlugInSkillRename: true,
                        enableCMESkills: false,
                        enableZIPFileUpload: false,
                        enablePrerequisites: false,
                        setSelectAllAsDefaultBehavior: true,
                        disableChannelAPI: false
                    }
                },
                reportPreferences: {
                    enabled: false,
                    preferences: {
                        uniqueRowInExternalReport: false,
                        uniqueRowInCompletionReport: false,
                        deletedUserReport: false,
                        excludeCustomField: false,
                        downloadReportsUsingBigQuery: false,
                        enableSCORMInteractionsReport: false,
                        useBigQueryForScreenReports: false
                    }
                }
            };
        }
    }
})();