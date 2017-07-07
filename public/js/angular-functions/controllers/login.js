var app = angular.module('did');
app.controller('LoginCtrl', function($scope, $state, $http, $window, $timeout) {
	var token = JSON.parse($window.localStorage.getItem('token'));
	console.log("token", token)
	if (token != null && token != undefined && token != "") {
		$state.go("dashboard.general")
	}
    $scope.loginSubmit = function(){
    	console.log("login clicked")

    	$http({
			method: "POST",
			headers:{'Content-Type':'application/x-www-form-urlencoded'},
			data:$.param({user: $scope.username, password: $scope.password}),
			url:"/api/login"
		})
		.then(function(data){
				console.log(data);
				let token = data.data.token
				$window.localStorage.setItem('token', JSON.stringify(token));
				$state.go("dashboard.general")
				console.log("after")
			}, function (err) {
				$scope.authError = true
				$timeout(function(){$scope.authError = false}, 4000)
				if (err.status === 401){
					delete $window.localStorage.removeItem('token');
					$state.go("login")
				} else
					console.log(err)
			}
		);
    }
});