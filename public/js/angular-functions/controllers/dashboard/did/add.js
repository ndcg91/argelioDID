 angular.module('did')
     .controller('DashboardDidAdd', function($scope, apiQuery,$state) {
         $scope.newDid = {
             tarifs: [],
         };
         $scope.tagAdded = (tag) => {
             console.log("addedd", tag)
             $scope.tarifs = $scope.tarifs.filter(x => x._id != tag._id)
         }
         $scope.tagRemoved = (tag) => {
             console.log(tag)
             $scope.tarifs.push(tag)
         }
         $scope.loadTarifs = (query) => {
             return apiQuery.tarif.get()
         }
         $scope.adTarif = (tarif) => {
             $scope.newDid.tarifs.push(tarif)
             $scope.tarifs = $scope.tarifs.filter(x => x._id != tarif._id)
         }
         apiQuery.tarif.get()
             .then(data => $scope.tarifs = data)
         $scope.createDid = () => {
             apiQuery.did.create($scope.newDid).then(()=> $state.go("dashboard.numbers.all"))
         }
     })
