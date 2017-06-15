var express = require("express");
var router = express.Router();
var users = require("../models/users.js")
var mongoose = require('mongoose');
var authentication = require("../helpers/authentication.js");
var auth = require("../helpers/auth.js");

router.get("/api",function(req,res){
	res.send({"ok":"api set"})
})

router.get("/test",auth.authenticate(),function(req,res){
	res.json(req.user)
})

router.post("/login",authentication.login)
router.post("/reset",authentication.reset)
router.get("/forgot/:id",authentication.forgot)

module.exports = router;
