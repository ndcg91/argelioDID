angular.module('did')

.controller('DashboardDidAll', function($scope, apiQuery, $uibModal, $log) {
    $scope.info = {
        asigned: 0,
        unasigned: 0,
        private: 0,
        public: 0,
        request: 0
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


    $scope.confirmUnasignement = (number) => {
        console.log("inside", number)
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: function($scope, $uibModalInstance, apiQuery, $window) {

                $scope.ok = function() {
                    $uibModalInstance.close(apiQuery.did.unasign(number._id).then(() => $window.location.reload()));
                };

                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: "small",
            appendTo: $("body"),
        });

        modalInstance.result.then(function(selectedItem) {}, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }


    $scope.confirmAsignement = (number) => {
        console.log("inside", number)
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'confirmAsignement.html',
            controller: function($scope, $uibModalInstance, apiQuery, $window) {

                $scope.ok = function() {
                    $uibModalInstance.close(apiQuery.did.confirm(number._id).then(() => $window.location.reload()));
                };

                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: "small",
            appendTo: $("body"),
        });

        modalInstance.result.then(function(selectedItem) {}, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
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
            })
            $scope.dids = data
        })
})
