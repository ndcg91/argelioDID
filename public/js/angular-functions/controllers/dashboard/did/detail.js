angular.module("did")
    .controller('DashboardNumberDetail', function($scope, apiQuery, $state) {
        let number = $state.params.number
        apiQuery.did.getById(number)
            .then(number => {
                apiQuery.did.tarif(number.number)
                    .then(data => {
                        number.tarifs = data
                        $scope.did = number
                    })
            })


   
         $scope.loadTarifs = (query) => {
             return apiQuery.tarif.get()
         }
        


        $scope.addTarif = function(tarif) {
            if ($scope.did.tarifs.filter(x => x._id == tarif._id).length == 0)
                $scope.did.tarifs.push(tarif)
        }

        $scope.delete = function() {
            apiQuery.did.delete($scope.did)
                .then(() => $state.go("dashboard.numbers.all"))
        }
        $scope.submit = () => {
            let did = angular.copy($scope.did)
            did.tarifs = [];
            $scope.did.tarifs.forEach(x => did.tarifs.push(x._id) )
            apiQuery.did.edit(number,did).then(() => $state.go("dashboard.numbers.all"))
   
        }
        var tarifs = [];
        $scope.tarifs = [];
        apiQuery.tarif.get()
            .then(data => {
                $scope.tarifs = data
                tarifs = data;
            })
    })
