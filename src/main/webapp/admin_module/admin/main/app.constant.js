(function () {
    'use strict';

    angular.module('implHit.admin')
        .constant('domain', location.hostname.split('.')[0])
        .constant('Path', {
            API_ENDPOINT_BASE_URL: 'http://qualityassurance.maj.optimizehit.appspot.com/api/admin',
            APP_CONTEXT_PATH: '/admin_module/index.html#',//TODO:switched to "hash mode" to avoid url rewriting filter requirement for now

            USER_INFO: '/company/getCompanyUserInfo',
            LOGIN: '/login',
            LOGOUT: '/advancedsupport/logout',

            LIST_USERS: '/user/listUsers',
            LIST_USER_REPORTS: '/reports/listUserReports',
            ADD_USER: '/user/addUser',
            EDIT_USER: '/user/editUser',
            UPLOAD_FILE: '/company/uploadFileBlob',
            DELETE_USER: '/user/deleteUser',

            LIST_ROLES: '/user/listRoles',
            ASSIGN_ROLE: '/user/assignRole',
            UN_ASSIGN_ROLE: '/user/unAssignRole',

            LIST_SITES: '/user/listSites',
            ADD_SITE: '/site/addSite',
            ASSIGN_SITE: '/user/assignSite',
            UN_ASSIGN_SITE: '/user/unAssignSite',

            LIST_DIVISIONS: '/user/listDivisions',
            ASSIGN_DIVISION: '/user/assignDiv',
            UN_ASSIGN_DIVISION: '/user/unAssignDiv',

            LIST_SKILLS: '/skill/listSkills',

            LIST_RULES: '/rule/listRules',
            ADD_RULE: '/rule/addRule',
            DELETE_RULE: '/rule/deleteRule',
            APPLY_RULE: '/rule/applyRule'
        })
        .constant('Page', {
            USERS: 'users',
            SKILLS: 'skills',
            ROLES: 'roles',
            RULES: 'rules',
            REPORTS: 'reports',
            GROUPS_MANAGEMENT: 'groups-management',
            DOMAIN_SETTINGS: 'domain-settings'
        });
})();