 angular.module("did")
 	.controller('DashboardTarifsList', function($scope, apiQuery) {
        apiQuery.tarif.get()
            .then(tarifs => $scope.tarifs = tarifs)
    })