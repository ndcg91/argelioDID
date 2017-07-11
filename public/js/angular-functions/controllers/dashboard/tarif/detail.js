angular.module("did")
    .controller('DashboardTarifsDetail', function($scope, apiQuery, $state) {
        let tarif = $state.params.tarif
        console.log(tarif)
        apiQuery.tarif.getOne(tarif)
            .then(tarif => $scope.tarif = tarif)

        $scope.submit = () => {
            if ($scope.editing){
                apiQuery.tarif.edit(tarif, $scope.tarif)
                    .then(() => $state.go("dashboard.tarifs.list"))
            }
            else{
                apiQuery.tarif.asignToDid($scope.tarif._id,did._id)
            }
        }
        $scope.dids = [];
        apiQuery.did.all()
            .then(data => {
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
