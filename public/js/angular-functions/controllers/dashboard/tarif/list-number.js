angular.module("did")
    .controller('DashboardTarifsListNumber', function($scope, apiQuery, $state) {
    	$scope.number = parseInt($state.params.number)
        
       
         $scope.adTarif = (tarif) => {
             $scope.tarif = tarif 
         }
         
         apiQuery.did.tarif($state.params.number)
         	.then(data => $scope.currentTarifs = data)

         $scope.submit = () => {
             apiQuery.did.asignTarif($state.params.number, $scope.tarif._id)
             	.then(() => $state.go("dashboard.numbers.all"))
         }
    })
