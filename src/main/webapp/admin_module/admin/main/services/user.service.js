(function () {
    'use strict';

    angular
        .module('implHit.admin')
        .factory('userService', userService);

    userService.$inject = ['$q', '$http', '$httpParamSerializer', 'Path'];

    function userService($q, $http, $httpParamSerializer, Path) {
        return {
            getUsers: getUsers,
            addUser: addUser,
            editUser: editUser,
            deleteUser: deleteUser,
            bulkUploadUsers: bulkUploadUsers
        };

        function getUsers(data) {
            data = data || {
                    "pageNo": 1,
                    "sortOrder": "asc",
                    "sortColumn": "email",
                    "noOfRecords": 20
                };

            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.LIST_USER_REPORTS,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }


        function addUser(data){
            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.ADD_USER,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function editUser(data){
            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.EDIT_USER,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: data})
            });
        }

        function bulkUploadUsers(data) {
            var deferred = $q.defer();

            var formData = new FormData();
            formData.append('myFile', data.myFile);
            formData.append('removeUser', data.removeUser);
            formData.append('email', data.email);
            formData.append('ignoreAutoAssign', data.ignoreAutoAssign);
            formData.append('forceAutoAssign', data.forceAutoAssign);

            $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.UPLOAD_FILE,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: {uploadType: 'userBulkUpload'}})
            }).then(function(result) {
                var uploadUrl = result.data['URL'];

                $http({
                    method: 'POST',
                    url: uploadUrl,
                    transformRequest: angular.identity,
                    headers: {
                        // By setting ?Content-Type?: undefined, the browser sets
                        // the Content-Type to multipart/form-data for us
                        // and fills in the correct boundary.
                        'Content-Type': undefined
                    },
                    data: formData
                }).then(function() {
                    deferred.resolve();
                }).catch(function() {
                    deferred.reject();
                });
            }).catch(function() {
                deferred.reject();
            });


            return deferred.promise;
        }

        function deleteUser(usersEmailList){
            return $http({
                method: 'POST',
                url: Path.API_ENDPOINT_BASE_URL + Path.DELETE_USER,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $httpParamSerializer({values: {userEmailList: usersEmailList}})
            });
        }
    }
})();