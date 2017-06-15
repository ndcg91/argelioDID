// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
// create a schema
var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, required:true },
  registerConfirmed: { type: Boolean, default: false },
  registrationToken: String,
  forgotToken: String,
  type: { type: String, required: true, enum: ['Admin', 'Almacen', 'Salon', 'Cocina', 'Jefe Sala'] },
  created_at: Date,
  updated_at: Date
});

userSchema.pre("save",function(next){
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }

});

// Create method to compare password input to password saved in database
userSchema.methods.comparePassword = function(pw, cb) {  
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};





// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;