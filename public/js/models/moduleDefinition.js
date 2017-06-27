var app = angular.module('did',['ui.router','ngStorage'])
	.service("auth",function($http,$q,$window){
		var token = JSON.parse($window.localStorage.getItem('token'));
		$http.defaults.headers.common['Authorization'] = token;
		this.getCurrentUser = function() {
		    var deferred = $q.defer();
		    if (token != null && token != undefined && token != "") {
		    	$http.get("/api/user/").success(function(data){
		    		deferred.resolve(data)
		    	}).error(function(msg,code){
		    		deferred.reject(msg)
		    	})
		    } else {
		        deferred.reject({msg: "token is empty"})
		    }
		    return deferred
		}
		var auth = false
		console.log("token", token)
		if (token != null && token != undefined && token != "") {
			auth = true
		}
		this.isAuthenticated = auth

	})
	.service('apiQuery', function($http,$q,$window){
		var endpointURL = config.getUrlApi();
		var token =  JSON.parse($window.localStorage.getItem('token'));

		$http.defaults.headers.common['Authorization'] = token;
	})
	
	.config(function($stateProvider, $urlRouterProvider){
	  $stateProvider
	    .state("dashboard", {
	      url: "/dashboard",
	      templateUrl: "partials/dashboard.html",
	      controller: "DashboardCtrl",
	      authenticate: true
	    })
	    .state("login", {
	      url: "/login",
	      templateUrl: "partials/login.html",
	      controller: "LoginCtrl",
	      authenticate: false
	    })
	    .state("register", {
	      url: "/register",
	      templateUrl: "partials/register.html",
	      controller: "RegisterCtrl",
	      authenticate: false
	    })
	    .state("account", {
	      url: "/account",
	      templateUrl: "partials/account.html",
	      controller: "AccountCtrl",
	      authenticate: true
	    });
	  // Send to login if the URL was not found
	  $urlRouterProvider.otherwise("/login");
	})

	.run(function ($rootScope, $state, auth) {
	  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
	    if (toState.authenticate && !auth.isAuthenticated){
	      // User isn’t authenticated
	      $state.transitionTo("login");
	      event.preventDefault(); 
	    }
	  });
	});
