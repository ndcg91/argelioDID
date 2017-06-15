var Users = require("../models/users.js");
var jwt = require("jsonwebtoken");  
var config = require("../config.js");
var crypto = require("crypto");

module.exports = {
	login: function(req,res){
		let user = req.body.user;
		let password = req.body.password;
		Users.findOne({username: user},function(err,user){
			if (!err && user != null){
				user.comparePassword(password, function(err,match){
					if (!err && match){
						let payload = {
							id: user._id
						}
						var token = jwt.sign(payload, config.jwtSecret, {
							expiresIn: 3600 // in seconds
						});
						res.json({ success: true, token: 'JWT ' + token });
					}
					else{
						res.status(401).send({error: "auth fail"})
					}
				})
			}
			else{
				res.status(401).send({error: "auth fail"})
			}
		})
	},
	register: function(req,res){
		let username = req.body.username;
		let password = req.body.password;
		let email = req.body.email;
		let type = req.body.type;

		if (username && password && email && type){
			let object = {
				username: username,
				password: password,
				email: email,
				type: type,
			}
		}
		else{
			res.status(401).send({error: "auth fail"})
		}
	},
	reset: function(req,res){
		var newPassword = req.body.password;
		var userForgotToken = req.body.token;
		if (newPassword == null || userForgotToken == null){
			res.status(401).send({error: "incorrect parameters"});
			return
		}

		Users.findOne({forgotToken:userForgotToken},function(err,user){
			if (err || user == null){
				res.status(401).send({error: "incorrect parameters"});
				return 
			}
			else{
				user.password = newPassword;
				user.save(function(err,savedUser){
					if (!err){
						res.json({success: true, msg: "user saved"})
						return
					}
				})
			}
		})
	},
	forgot: function(req,res){
		var userID = req.params.id;
		Users.findById(userID,function(err,user){
			if (!err && user != null){

				user.forgotToken = jwt.sign({message:crypto.randomBytes(64).toString('hex')}, config.jwtSecret, {
					expiresIn: 3600 // in seconds
				});
				user.save()
				res.send({message:"password reset token set"})
			}
			else{
				res.status(403).send({error:"user not found"})
			}
		})
	}
}