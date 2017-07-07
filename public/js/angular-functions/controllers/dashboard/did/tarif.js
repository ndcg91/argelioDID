angular.module("did")
    .controller('DashboardDidTarifList', function($scope, $state, apiQuery) {
        console.log("inside")
        var tarifId = $state.params.tarifId;
        console.log(tarifId)
        apiQuery.did.getAsignedToTarif(tarifId).then(data => $scope.dids = data)
    })
