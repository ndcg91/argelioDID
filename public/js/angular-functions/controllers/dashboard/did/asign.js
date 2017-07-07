angular.module("did")
    .controller('DashboardDidAsign', function($scope, apiQuery, $state) {
        $scope.users = [];
        $scope.asignUser = (user) => {
            $scope.asignedUser = user
        }
        $scope.submit = () => {
            apiQuery.did.asign($scope.asignedUser._id, $scope.currentDid._id)
                .then(data => $state.go("dashboard.numbers.all"))
                .catch(err => console.log(err))
        }
        apiQuery.user.getAll()
            .then(users => { $scope.users = users })
        apiQuery.did.getById($state.params.number).then(did => $scope.currentDid = did)
    })
