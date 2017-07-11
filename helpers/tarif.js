var Dids = require("./../models/did");
var Users = require("./../models/users");
var Tarif = require("./../models/tarif") 
 module.exports = {
     get: (req, res) => {
         Tarif.find()
             .then(tarifs => res.send(tarifs))
             .catch(err => res.send(err))
     },
     getOne: (req, res) => {
         Tarif.findById(req.params.tarif)
             .then(tarif => res.send(tarif))
             .catch(err => res.send(err))
     },
     editOne: (req, res) => {
         Tarif.findByIdAndUpdate(req.params.tarif, {
                 description: req.body.description,
                 price_per_minute: req.body.price_per_minute,
                 billing_terms: req.body.billing_terms,
                 visible: req.body.visible
             })
             .then(tarif => {
                 res.send(config.defaultSuccess)
             })
             .catch(err => res.send(err))
        
     },
     create: (req, res) => {
         //req.body parameters 
         let user = req.user;
         let description = req.body.description
         let price_per_minute = req.body.price_per_minute
         let billing_terms = req.body.billing_terms
         let visible = req.body.visible
             //end req.body parameters

         //only admin cad add tarif to a did
         var tarif = new Tarif({
                 description: description,
                 price_per_minute: price_per_minute,
                 billing_terms: billing_terms,
                 visible: visible
             })
             //creating tarif
         tarif.save()
             .then((tarif_saved) => res.send(config.defaultSuccess))
             .catch(err => res.status(403).send(err))
        
     },
     tarifByNumber: (req,res) => {
        let number = req.params.number;
        let user = req.user;
        if (user.isAdmin()){
            //Admin is allowed to change any tarif even if the number is not assigned to them
            Dids.findOne({number: number})
                .then(did => {
                    tarifPromises = [];
                    did.tarifs.forEach(e => tarifPromises.push(Tarif.findById(e)))
                    Promise.all(tarifPromises)
                        .then(tarifs => res.send(tarifs))
                        .catch(err => res.send(err))
                })
                .catch(err => res.send(err))
        }
        else{
            Dids.findOne({number:number, belongs_to: user._id})
                .then(did => {
                    if (!did) 
                        res.send({msg: "The did is not assigned to the user"})
                    else{
                        tarifPromises = [];
                        did.tarifs.forEach(e => tarifPromises.push(Tarif.findById(e)))
                        Promise.all(tarifPromises)
                            .then(tarifs => res.send(tarifs))
                            .catch(err => res.send(err))
                    }
                })
                .catch(err => res.send(err))
        }
    },
     delete: (req, res) => {
        var promises = [
            Dids.update(
                {tarifs: req.params.id},
                {
                    $pullAll: { tarifs: [req.params.id] }
                },
                {"multi": true}
            ),
            Dids.update(
                {current_tarif: req.params.id},
                {
                    $unset: { current_tarif: ""}
                },
                {"multi": true}
            ),
            Tarif.findByIdAndRemove(req.params.id)

        ]
        Promise.all(promises)
             .then(() => res.send(config.defaultSuccess))
             .catch(err => res.send(err))
     }
 }
