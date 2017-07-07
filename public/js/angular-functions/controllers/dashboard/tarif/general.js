angular.module("did")
    .controller('DashboardTarifs', function($scope, apiQuery) {
        $scope.tarifs = [];
        apiQuery.tarif.get()
            .then(tarifs => $scope.tarifs = tarifs)
    })
