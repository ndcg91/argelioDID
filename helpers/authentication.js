var Users = require("../models/users.js");
var jwt = require("jsonwebtoken");  
var config = require("../config.js");
var crypto = require("crypto");
var mailer = require("../mailer")

module.exports = {
	login: (req,res) => {
		let user = req.body.user;
		let password = req.body.password;

		Users.findOne({username: user})
			.then(user => {
				user.comparePassword(password)
					.then(() => {
						let payload = { id: user._id }
						let token = jwt.sign(payload, config.jwtSecret, { expiresIn: 31536000 });
						res.send({ success: true, token: 'JWT ' + token })
					})
					.catch(() => res.status(401).send({error: "auth fail"}) )
			})
			.catch(() => res.status(401).send({error: "auth fail"}))
	},

	register: (req,res) => {
		let username = req.body.username;
		let password = req.body.password;
		let email = req.body.email;
		let type = req.body.type || "Client"

		if (username && password && email && type){
			let newUser  = new Users({
				username: username,
				password: password,
				email: email,
				type: type,
				registrationToken: jwt.sign({message:crypto.randomBytes(64).toString('hex')}, config.jwtSecret, {
					expiresIn: 3600 // in seconds
				})
			})
			newUser.save()
				.then(() => {
					mailer.sendRegisterMail(newUser.registrationToken, newUser.email)
					res.send({msg:"registered"})
				})
				.catch(err => res.status(401).send({error: "auth fail"}) )
		}
		else{
			res.status(401).send({error: "auth fail"})
		}
	},

	resendActivation: (req, res) => {
	    let user = req.body.email;
	    Users.findOne({ email: user })
	        .then(user => {
	            let registrationToken =  jwt.sign({ message: crypto.randomBytes(64).toString('hex') }, config.jwtSecret, {
	                expiresIn: 3600 // in seconds
	            })
	            user.registrationToken = registrationToken
	            user.save()
	            	.then(()=> {
	            		mailer.sendRegisterMail(user.registrationToken, user.email)
	            	})
	            	.catch(err => res.render("registration_check_email"))
	           
	        })
			.catch(err => res.render("registration_check_email"))
	},

	confirmRegister: (req, res) => {
		jwt.verify(req.params.token, config.jwtSecret, (err,decoded) => {
			if (err)
				res.render('registration_confirmed_error')
			else{
				Users.findOne({ registrationToken: req.params.token }).then(user => {
		            user.registerConfirmed = true
		            user.save();
		            res.render('registration_confirmed_success')
		        })
		        .catch(err => {
		            res.render('registration_confirmed_error')
		        })
			}
		})
			
	    	
	},


	reset: (req,res) => {
		var newPassword = req.body.password;
		var userForgotToken = req.body.token;
		if (newPassword == null || userForgotToken == null){
			res.status(401).send({error: "incorrect parameters"});
			return
		}

		Users.findOne({forgotToken:userForgotToken})
			.then( (err,user) => {
				user.password = newPassword;
				user.save(function(err,savedUser){
					if (!err){
						res.json({success: true, msg: "user saved"})
						return
					}
				})
			})
			.catch(err => res.status(401).send({error: "incorrect parameters"}) )
	},


	forgot: (req,res) => {
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