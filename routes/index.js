var express = require("express");
var router = express.Router();
var users = require("../models/users.js")
var mongoose = require('mongoose');
var authentication = require("../helpers/authentication.js");
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
	users.findOne({registrationToken: req.params.token},function(err,user){
		user.registerConfirmed = true
		user.save();
		res.render('login_register')
	})
})
router.post("/login",authentication.login)
router.post("/reset",authentication.reset)
router.get("/forgot/:id",authentication.forgot)
router.post("/register",authentication.register)

module.exports = router;
