var app = angular.module('did');
app.controller('DashboardCtrl', function($scope, $state, $http, $window, $timeout) {
	var token = JSON.parse($window.localStorage.getItem('token'));
	console.log("token", token)

    $scope.logout = function(){
		delete $window.localStorage.removeItem('token');
		$state.go("login")
    }
});