var express = require("express");
var router = express.Router();
var Users = require("../models/users.js")
var Dids = require("../models/did.js")
var authentication = require("../helpers/authentication.js");
var did = require("../helpers/did.js");
var auth = require("../helpers/auth.js");

router.get("/",function(req,res){
	res.send({"ok":"api set"})
})

router.get("/test",auth.authenticate(),function(req,res){
	res.json(req.user)
})
router.get("/user",auth.authenticate(),function(req,res){ 
	res.json(req.user) 
})
router.get("/register/:token",function(req,res){
	Users.findOne({registrationToken: req.params.token},function(err,user){
		user.registerConfirmed = true
		user.save();
		res.render('login_register')
	})
})
router.post("/login",authentication.login)
router.post("/reset",authentication.reset)
router.get("/forgot/:id",authentication.forgot)
router.post("/register",authentication.register)
router.get("/users",auth.authenticate(),(req,res) => {
	if (req.user.isAdmin()){
		Users.find({},'name username email created_at')
			.then(users => res.send(users))
			.catch(err => res.send(err))
	}
	else{
		res.send({msg: "Only admin can get user list"})
	}
})

router.get("/did",auth.authenticate(),did.asignedToMe)
router.post("/did/asign",auth.authenticate(),did.asign)
router.post("/did/asign/confirm",auth.authenticate(),did.asignConfirm)

router.get("/did/all",auth.authenticate(),did.getAll)
router.get("/did/:id",auth.authenticate(),(req,res) => {
	if (req.user.isAdmin()){
		Dids.findById(req.params.id)
			.then(did => res.send(did))
			.catch(err => res.send(err))
	}
	else{
		res.send({msg: "Only admin can get user list"})
	}
})

router.get("/did/unasigned",auth.authenticate(),did.getFree)
router.post("/did",auth.authenticate(),did.create)
router.delete("/did/:id",auth.authenticate(),did.delete)
router.post("/did/unasign",auth.authenticate(),did.unasign)


router.post("/tarif",auth.authenticate(),did.tarif.create)
router.get("/tarifs",auth.authenticate(),did.tarif.get)
router.get("/did/tarif/:number",auth.authenticate(),did.tarifByNumber)
router.get("/dids/aisgnedToTarif/:tarif",auth.authenticate(),did.getByTarifId)
router.post("/did/asignTarif",auth.authenticate(), did.asignTarif)



module.exports = router;
