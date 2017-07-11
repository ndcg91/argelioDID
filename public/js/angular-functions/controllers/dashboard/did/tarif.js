angular.module("did")
    .controller('DashboardDidTarifList', function($scope, $state, apiQuery) {
        console.log("inside")
        var tarifId = $state.params.tarifId;
        console.log(tarifId)
        apiQuery.did.getAsignedToTarif(tarifId).then(data => {
    	 	data.forEach(did => {
	        	if (did.belongs_to != null && did.belongs_to != "") {
	                did.belongs_to = JSON.parse(did.belongs_to)
	            }
	            if (did.current_tarif != null && did.current_tarif != "") {
	                did.current_tarif = JSON.parse(did.current_tarif)
	            }
	        })
        	$scope.dids = data

        })
    })
