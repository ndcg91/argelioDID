angular.module("did")
    .service('apiQuery', function($http, $q, $window) {
        var token = JSON.parse($window.localStorage.getItem('token'));
        console.log(token)
        $http.defaults.headers.common['Authorization'] = token;

        this.getUser = () => {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get('/api/user')
                .then(data => {
                    defered.resolve(data.data)
                }).catch(err => {
                    defered.reject(err)
                })
            return promise
        }
        this.user = {
            getAll: () => {
                var defered = $q.defer();
                var promise = defered.promise;

                $http.get("/api/users")
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            }
        }

        this.did = {
            getById: (id) => {
                var defered = $q.defer();
                var promise = defered.promise;

                $http.get("/api/did/"+id)
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            },
            confirm: (did) => {
                var defered = $q.defer();
                var promise = defered.promise;
                $http.post("/api/did/asign/confirm",{did:did})
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            },
            asign: (user,did) => {
                var defered = $q.defer();
                var promise = defered.promise;
                $http.post("/api/did/asign",{user:user,did:did})
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            },
            all: () => {
                var defered = $q.defer();
                var promise = defered.promise;

                $http.get("/api/did/all")
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            },
            getAsignedToTarif: (tarif) => {
                var defered = $q.defer();
                var promise = defered.promise;

                $http.get("/api/dids/aisgnedToTarif/" + tarif )
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            },
            create: (did) => {
                did.tarifs.map(x => x._id)
                var defered = $q.defer();
                var promise = defered.promise;

               

                $http.post("/api/did",did)
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            },
            unasign: (did) => {
                var defered = $q.defer();
                var promise = defered.promise;
                $http.post("/api/did/unasign",{did: did})
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            },
            tarif: (number) => {
                var defered = $q.defer();
                var promise = defered.promise;

                $http.get("/api/did/tarif/" + number )
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            },
            asignTarif: (number, tarif) => {
                var defered = $q.defer();
                var promise = defered.promise;
                $http.post("/api/did/asignTarif",{did: number,tarif: tarif})
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            }
            
        }
        this.tarif = {
            create: (description, price_per_minute, billing_terms, visible) => {
                var defered = $q.defer();
                var promise = defered.promise;
                $http.post("/api/tarif",{description: description, price_per_minute: price_per_minute, billing_terms: billing_terms, visible: visible})
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise
            },
            get: () => {
                var defered = $q.defer();
                var promise = defered.promise;

                $http.get("/api/tarifs")
                    .then(data => defered.resolve(data.data))
                    .catch(err => defered.reject(err))
                return promise;
            }
        }


    })
