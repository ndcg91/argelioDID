angular.module('did')
    .controller('DashboardCtrl', function($scope, $state, $http, $window, $timeout, apiQuery) {
        var token = JSON.parse($window.localStorage.getItem('token'));
        console.log("token", token)

        $scope.user = apiQuery.getUser()
            .then(data => {
                $scope.user = data
                console.log(data)
            })
            .catch(err => {
                console.log(err)
                $scope.logout()
            })


        $scope.logout = function() {
            delete $window.localStorage.removeItem('token');
            $state.go("login")
        }
    })
    .controller('DashBoardGeneral', function($scope) {

    })
    
  
