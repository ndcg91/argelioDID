var express = require("express");
var router = express.Router();
var authentication = require("../helpers/authentication.js");
var did = require("../helpers/did.js");
var tarif = require("../helpers/tarif.js");

var user = require("../helpers/user.js");
var auth = require("../helpers/auth.js");





/*=============================
=            LOGIN            =
=============================*/
router.post("/login",authentication.login)
router.post("/reset",authentication.reset)
router.get("/forgot/:id",authentication.forgot)
router.post("/register",authentication.register)
/*=====  End of LOGIN  ======*/




/*============================
=            USER            =
============================*/
router.get("/user",auth.authenticate(), user.get)
router.get("/user/all", auth.authenticate(), auth.onlyAdmin, user.getAll)

/*=====  End of USER  ======*/


/*===========================
=            DID            =
===========================*/
router.get("/did",auth.authenticate(),did.get) //will return did asigned to the user
router.get("/did/all",auth.authenticate(),auth.onlyAdmin, did.getAll)
router.get("/dids/aisgnedToTarif/:tarif",auth.authenticate(),did.getByTarifId)

router.post("/did",auth.authenticate(),auth.onlyAdmin,did.create) //create a did, only admin feature
router.post("/did/asign",auth.authenticate(),did.asign)
router.post("/did/asign/confirm",auth.authenticate(),auth.onlyAdmin,did.asignConfirm)
router.post("/did/unasign",auth.authenticate(),did.unasign)
router.get("/did/unasigned",auth.authenticate(),did.getFree)
router.delete("/did/:id",auth.authenticate(),auth.onlyAdmin, did.delete)
router.post("/did/asignTarif",auth.authenticate(), did.asignTarif)
router.patch("/did/:id",auth.authenticate(), auth.onlyAdmin, did.modify)
router.get("/did/:id",auth.authenticate(),auth.onlyAdmin, did.getOne)


/*=====  End of DID  ======*/



/*=============================
=            TARIF            =
=============================*/
router.post("/tarif",auth.authenticate(), auth.onlyAdmin, tarif.create) //only admin is allowed to create a tarif
router.get("/tarifs",auth.authenticate(),tarif.get) 
router.get("/tarif/:tarif",auth.authenticate(),auth.onlyAdmin,tarif.getOne) //only admin can view one tarif in detail
router.patch("/tarif/:tarif",auth.authenticate(),auth.onlyAdmin, tarif.editOne) //only admin can edit one tarif
router.get("/tarif/did/:number",auth.authenticate(),tarif.tarifByNumber) 
/*=====  End of TARIF  ======*/


router.get("/",function(req,res){
	res.send({"ok":"api set"})
})















module.exports = router;
