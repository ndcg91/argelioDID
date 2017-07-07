var Users = require("../models/users.js"),
 	passport = require("passport"),
	passportJWT = require("passport-jwt"),
	cfg = require("../config.js");

var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {  
	secretOrKey: cfg.jwtSecret,
	jwtFromRequest: ExtractJwt.fromAuthHeader()
};

var strategy = new Strategy(params, function(payload, done) {
    let userID = payload.id;
    console.log("inside")
    Users.findById(userID, '-password -_id')
    .then( user =>  done(null, user))
    .catch( err =>  done(new Error("User not found"), null) )
});
passport.use(strategy);

module.exports = {
    initialize: function() {
        return passport.initialize();
    },
    authenticate: function() {
        return passport.authenticate("jwt", cfg.jwtSession);
    }
};
