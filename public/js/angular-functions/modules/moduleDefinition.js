var app = angular.module('did', ['ui.router', 'ngStorage', 'ngTagsInput', 'ui.bootstrap'])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state("dashboard", {
            url: "/dashboard",
            templateUrl: "partials/dashboard/dashboard.html",
            controller: "DashboardCtrl",
            authenticate: true,
            abstract: true
        })
        .state("dashboard.general", {
            url: "/general",
            templateUrl: "partials/dashboard/general.html",
            controller: "DashBoardGeneral",
            authenticate: true,
        })
        .state("dashboard.numbers", {
            url: "/numbers",
            templateUrl: "partials/dashboard/numbers/numbers.html",
            controller: "DashboardDid",
            authenticate: true,
            abstract: true
        })
        .state("dashboard.numbers.all", {
            url: "/all",
            templateUrl: "partials/dashboard/numbers/all.html",
            controller: "DashboardDidAll",
            authenticate: true,
        })
        .state("dashboard.numbers.assign", {
            url: "/assign/:number",
            templateUrl: "partials/dashboard/numbers/asign.html",
            controller: "DashboardDidAsign",
            authenticated: true
        })
        .state("dashboard.numbers.add", {
            url: "/add",
            templateUrl: "partials/dashboard/numbers/add.html",
            controller: "DashboardDidAdd",
            authenticate: true,
        })
        .state("dashboard.numbers.tarif", {
            url: "/tarif/:tarifId",
            templateUrl: "partials/dashboard/numbers/tarif_list.html",
            controller: "DashboardDidTarifList",
            authenticate: true,
        })
        .state("dashboard.numbers.detail", {
            url: "/detail/:number",
            templateUrl: "partials/dashboard/numbers/detail.html",
            controller: "DashboardNumberDetail",
            authenticate: true,
        })
        .state("dashboard.tarifs", {
            url: "/tarifs",
            templateUrl: "partials/tarifs/tarifs.html",
            controller: "DashboardTarifs",
            authenticate: true,
            abstract: true
        })
        .state("dashboard.tarifs.add", {
            url: "/add",
            templateUrl: "partials/tarifs/add.html",
            controller: "DashboardTarifsAdd",
        })
        .state("dashboard.tarifs.list", {
            url: "/list",
            templateUrl: "partials/tarifs/list.html",
            controller: "DashboardTarifsList",
            authenticate: true,
        })
        .state("dashboard.tarifs.number", {
            url: "/number/:number",
            templateUrl: "partials/tarifs/list_number.html",
            controller: "DashboardTarifsListNumber",
            authenticate: true,
        })
        .state("dashboard.tarifs.detail", {
            url: "/detail/:tarif",
            templateUrl: "partials/tarifs/detail.html",
            controller: "DashboardTarifsDetail",
            authenticate: true,
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
.controller("didTableController", function($scope,$uibModal,apiQuery,$log){
	$scope.confirmUnasignement = (number) => {
        console.log("inside", number)
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: function($scope, $uibModalInstance, apiQuery, $window) {

                $scope.ok = function() {
                    $uibModalInstance.close(apiQuery.did.unasign(number._id).then(() => $window.location.reload()));
                };

                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: "small",
            appendTo: $("body"),
        });

        modalInstance.result.then(function(selectedItem) {}, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.confirmRemoval = (number) => {
        console.log("inside", number)
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'confirmRemoval.html',
            controller: function($scope, $uibModalInstance, apiQuery, $window) {

                $scope.ok = function() {
                    $uibModalInstance.close(apiQuery.did.delete(number._id).then(() => $window.location.reload()));
                };

                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: "small",
            appendTo: $("body"),
        });

        modalInstance.result.then(function(selectedItem) {}, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }


    $scope.confirmAsignement = (number) => {
        console.log("inside", number)
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'confirmAsignement.html',
            controller: function($scope, $uibModalInstance, apiQuery, $window) {

                $scope.ok = function() {
                    $uibModalInstance.close(apiQuery.did.confirm(number._id).then(() => $window.location.reload()));
                };

                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: "small",
            appendTo: $("body"),
        });

        modalInstance.result.then(function(selectedItem) {}, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
})
.run(function($rootScope, $state, auth) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !auth.getAuthStatus()) {
                // User isn’t authenticated
                $state.transitionTo("login");
                event.preventDefault();
            }
        });
    })
    .directive("didTableDetail", function() {
        return {
            restrict: 'E',
            scope: {
                dids: '=dids',
                filter: '=filter',
            },
            // link: function(scope, elm, attrs, parentController) {
            //     scope.confirmAsignement = (did) => {
            //     	parent
            //     }
            //     scope.itemSelect = function(id) {
            //         myGreatParentControler.setSelected(id)
            //     }
            // }
            templateUrl: 'partials/includes/did_detail_table.html'
        };
    })
    .directive("tarifTableDetail", function() {
        return {
            restrict: 'E',
            scope: {
                tarifs: '=tarifs'
            },
            templateUrl: 'partials/includes/tarif_detail_table.html'
        };
    })
