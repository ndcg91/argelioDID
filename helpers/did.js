var Dids = require("./../models/did");
var Users = require("./../models/users");
var Tarif = require("./../models/tarif")
var moment = require("moment");
var config = require("./config")



/**

	TODO:
	ADMIN ACTIONS
	- Create, we created only with the number, only admin *** completed
	- Modify, we are only allowed to modify the number, only admin ** completed
	- Delte, only admin ** completed
	- getAll. get all dids, only admin ** completed **
	- createTarif

	USER ACTIONS
	- getFree, Get a list of free dids. These dids need to have a tarif assigned to them. **completed
	- asignedToMe. List of dids asigned to a user, need to have a tarif already assigned ** completed.
	- Asign a did. The customer will request a did asignation but the tdid is assigned by the admin 

	AUTOMATED ACTION:
	- checker . Check the expiration time of dids **completed

 */


var fillPhoneData = (phones) => {
    return new Promise( (fulfill, reject) => {
        var phonePromises = [];
        phones.forEach(phone => {
            if (phone.belongs_to){
                let currentPromise = Users.findById(phone.belongs_to,'name username email created_at')
                phonePromises.push(currentPromise)
                currentPromise.then(user => phone.belongs_to = JSON.stringify(user))
                currentPromise.catch(err => res.send(err))
            }
            if (phone.current_tarif){
                let currentPromise = Tarif.findById(phone.current_tarif)
                phonePromises.push(currentPromise)
                currentPromise.then(tarif => phone.current_tarif = JSON.stringify(tarif))
                currentPromise.catch(err => res.send(err))
            }
        })
        Promise.all(phonePromises)
            .then(()=> fulfill(phones))
            .catch(err => reject(err))
    })
    
}





module.exports = {
    get: (req, res) => {
        Dids.find({belongs_to: req.user._id})
            .then((phones) => {
                fillPhoneData(phones)
                    .then(dids => res.send(dids))
                    .catch(err => res.send(err))
            })
            .catch((err) => res.status(403).send(err))
    },
    getAll: (req, res) => {
        Dids.find()
            .then(phones => {
                console.log(phones)
                fillPhoneData(phones)
                    .then(dids => res.send(dids))
                    .catch(err => res.send(err))
            })
            .catch((err) => res.status(403).send(err))
    },
    getFree: (req, res) => {
        Dids.find({ asigned: false, 'tarif.0': { exists: true } }).then(phones => res.send(phones)).catch(err => res.status(403).send(err))
    },
    getOne: (req,res) => {
        Dids.findById(req.params.id)
            .then(did => res.send(did))
            .catch(err => res.send(err))
    },
    getByTarifId: (req,res) => {
    	Dids.find({tarifs: req.params.tarif})
    		.then(dids => {
                fillPhoneData(dids)
                    .then(dids => res.send(dids))
                    .catch(err => res.send(err))
            }) 
    		.catch( err => res.send(err))
    },
    create: (req, res) => {
        let number = new Dids({
            number: req.body.number,
            private: req.body.private,
            test: req.body.test,
            tarifs: req.body.tarifs
        })
        number.save().then(p => {
            res.send({ msg: config.defaultSuccess })
        }).catch(err => res.status(403).send(err))  
    },
    modify: (req, res) => {
        console.log("inside")
        Dids.findById(req.params.id).then(did => {
                did.number = req.body.number
                did.tarifs = req.body.tarifs
                did.test = req.body.test
                did.private = req.body.private
                did.description = req.body.description
                did.save().then(data => res.send(data)).catch(err => res.send(err))
            })
            .catch(err => res.status(403).send(err))
    },

    /**
        *
        * Asign a tarif to the did selecting the tarif that have the did already available
        *
        */
          
    asignTarif: (req,res) => {
        let tarif = req.body.tarif
        let user = req.user
        let did = req.body.did
        if (user.isAdmin()){
            Dids.findOne({number:did, tarifs: tarif})
                .then(did => {
                    if (!did){
                        res.send({msg: "The tarif is not assigned to the did"})
                        return
                    }
                    did.current_tarif = tarif
                    did.save()
                        .then(()=> res.send(config.defaultSuccess))
                        .catch(err => res.send(err))
                })
                .catch(err => res.send(err))
        }
        else{
            Dids.findOne({number:number, belongs_to: user._id})
                .then(did => {
                    if (!did){
                        res.send({msg: "The did is not assigned to the user"})
                        return
                    }
                    else{
                        Dids.findOne({number:did, tarifs: tarif})
                            .then(did => {
                                did.current_tarif = tarif
                                did.save()
                                    .then(()=> res.send(config.defaultSuccess))
                                    .catch(err => res.send(err))
                            })
                            .catch(err => res.send(err))
                    }

                })
                .catch(err => res.send(err))
        }
    },
    asign: (req, res) => {
        //a did can only be assigned if it is free
        var user = req.user
        var did = req.body.did;
        if (user.isAdmin()){
            user = req.body.user
        }
        else{
            user = user._id
        }
        Dids.findOne({ _id: did, asigned: false })
            .then(did => {
                did.asigned = true
                did.belongs_to = user;
                if (req.user.isAdmin())
                    did.asignation_confirmed = true
                did.save();
                Users.findById(user)
                    .then(u => {
                        u.dids.push(did._id)
                        u.save().then(user => res.send({ msg: "did added" })).catch(err => res.send(err))
                    })
            })
            .catch(err => res.status(403).send(err))
    },
    asignConfirm: (req,res) => {
        let user = req.user;
        let did = req.body.did;
        Dids.findByIdAndUpdate(did,{asignation_confirmed: true})
            .then(() => res.send(config.defaultSuccess))
            .catch(err => res.send(err))
       
    },
    unasign: (req,res) => {
        let user = req.user
        let did = req.body.did
        Dids.findById(did)
            .then(findedDid => {
                //Remove the asignement from the user profile
                Users.findById(findedDid.belongs_to)
                    .then(user => {
                        user.dids = user.dids.filter(d => d != did)
                        user.save().then(() => {
                            findedDid.asigned = false
                            findedDid.belongs_to = null
                            findedDid.save().then(()=> res.send(config.defaultSuccess)).catch(err => res.send(err))
                        })
                    })
                    .catch(err => res.send(err))
                
            })
        
    },
    delete: (req, res) => {
        var promises = [
            Users.update(
                {dids: req.params.id},
                {
                    $pullAll: { dids: [req.params.id] }
                },
                {"multi": true}
            ),
            Dids.findByIdAndRemove(req.params.id)
        ];
        Promise.all(promises)
            .then(() => res.send({ msg: "removed" }))
            .catch(err => res.status(403).send(err))
    },
    checker: () => {
        //check for every did to unasigne it if expired
        var expirationDate = moment().subtract(config.didExpirationInHours, "hours").toDate()
        Dids.find({ asigned: true, lastCall: { $lt: expirationDate }, lastCall: { $ne: null } })
            .then(dids => {
                console.log(dids)
                dids.forEach(did => {
                    User.findById(did.belongs_to).then(usr => {
                        usr.dids = usr.dids.filter(x => x != x._id)
                        usr.save().then(usrSaved => did.belongs_to = null)
                    })
                    did.asigned = false
                    did.lastCall = null
                    did.asigned_at = null
                    did.save()
                })
            }).catch(err => {
                console.log("no dids expired")
            })
            //recheck once the expiration time has pased 
        setTimeout(() => { this.checker() }, config.didExpiration)
    },








   
}
