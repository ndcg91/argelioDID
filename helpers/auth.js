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
    Users.findById(userID, '-password -_id', function(err,user){
        if (err || user == null){
            return done(new Error("User not found"), null);
        }
        else{
            return done(null, user)
        }
    })
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
