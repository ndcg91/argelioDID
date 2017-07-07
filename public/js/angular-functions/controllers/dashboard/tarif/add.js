angular.module("did")
    .controller('DashboardTarifsAdd', function($scope, apiQuery, $state) {
        $scope.createTarif = function() {
            apiQuery.tarif.create($scope.description, $scope.price, $scope.billing, $scope.visible).then(data => $state.go("dashboard.tarifs.list"))
        }
    })
