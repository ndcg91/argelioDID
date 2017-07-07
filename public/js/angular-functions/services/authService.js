angular.module("did")
    .service("auth", function($http, $q, $window) {
        var token = JSON.parse($window.localStorage.getItem('token'));
        $http.defaults.headers.common['Authorization'] = token;
        this.getCurrentUser = function() {
            var deferred = $q.defer();
            if (token != null && token != undefined && token != "") {
                $http.get("/api/user/").success(function(data) {
                    deferred.resolve(data)
                }).error(function(msg, code) {
                    deferred.reject(msg)
                })
            } else {
                deferred.reject({ msg: "token is empty" })
            }
            return deferred
        }

        this.getAuthStatus = () => {
            token = JSON.parse($window.localStorage.getItem('token'));
            var auth = false
            if (token != null && token != undefined && token != "") {
                auth = true
            }
            return auth
        }

    })
