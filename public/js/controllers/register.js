var app = angular.module('did');
app.controller('RegisterCtrl', function($scope,$state,$window,$http,$timeout) {
    var token = JSON.parse($window.localStorage.getItem('token'));
	console.log("token", token)
	if (token != null && token != undefined && token != "") {
		$state.go("dashboard")
	}
    $scope.registerSubmit = function(){
    	console.log("register clicked")
    	if ($scope.password == $scope.passwordConfirm){
    		$scope.authError = true
			$timeout(function(){$scope.authError = false}, 4000)
    	}
    	else{
    		$http({
				method: "POST",
				headers:{'Content-Type':'application/x-www-form-urlencoded'},
				data:$.param({username: $scope.username, password: $scope.password, email: $scope.email}),
				url:"/api/register"
			})
			.then(function(data){
					console.log(data);
					
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
    	
    }
});