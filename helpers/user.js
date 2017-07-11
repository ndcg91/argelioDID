var Users = require("./../models/users");



module.exports = {
	get: (req,res) => { res.send(req.user) },
	//this request is admin authenticated so we dont need to check if the user is admin
	getAll : (req,res) => {
		Users.find({},'-password')
			.then(users => res.send(users))
			.catch(err => res.send(err))
	}
}



