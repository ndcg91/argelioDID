angular.module('did')

.controller('DashboardDidAll', function($scope, apiQuery) {
    $scope.info = {
        asigned: 0,
        unasigned: 0,
        private: 0,
        public: 0,
        request: 0,
        total: 0
    }
    $scope.status = {
        free: true,
        assigned: true,
        pending: true,
        testing: true,
        sumary: true,
        private: true,
        visible: true
    }

    $scope.setDidList = (section)=>{
        switch (section) {
            case "free":
                // statements_1
                $scope.dids = dids.filter(x => !x.test && !x.asigned)
                break;
            case "asigned":
                // statements_1
                $scope.dids = dids.filter(x => !x.test && x.asigned && x.asignation_confirmed)
                break;
            case "pending confirmation":
                // statements_1
                $scope.dids = dids.filter(x => !x.test && x.asigned && !x.asignation_confirmed)
                break;
            case "testing":
                $scope.dids = dids.filter(x => x.test)
                // statements_1
                break;
            case "private":
                $scope.dids = dids.filter(x => !x.test && x.private)
                // statements_1
                break;
            case "public":
                $scope.dids = dids.filter(x => !x.test && !x.private)
                // statements_1
                break;
            default:
                $scope.dids = dids
                // statements_def
                break;
        }
    }

    
    var dids = [];
    apiQuery.did.all()
        .then(data => {
            data.forEach(did => {
                if (did.belongs_to != null && did.belongs_to != "") {
                    did.belongs_to = JSON.parse(did.belongs_to)
                }
                if (did.current_tarif != null && did.current_tarif != "") {
                    did.current_tarif = JSON.parse(did.current_tarif)
                }
                if (did.asigned && !did.test)
                    $scope.info.asigned += 1
                else if (!did.test)
                    $scope.info.unasigned += 1
                if (did.private && !did.test)
                    $scope.info.private += 1
                else if (!did.test)
                    $scope.info.public += 1
                if (did.asignation_confirmed && !did.test)
                    $scope.request += 1
                $scope.info.total += 1
            })
            $scope.dids = data
            dids = angular.copy(data)
        })
})
