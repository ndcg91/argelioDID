// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create a schema
var didSchema = new Schema({
  number: { type: Number, unique: true },
  tarifs: {type: [String], default: []},
  asigned: { type: Boolean, default: false },
  total_seconds: {type: Number, default: 0},
  created_at: Date,
  asigned_at: Date,
  lastCall: Date,
  private: {type: Boolean, default: false},
  updated_at: Date,
  belongs_to: String,
  current_tarif: String,
  test: {type: Boolean, default: false},
  asignation_confirmed: {type: Boolean, default: false}
});

didSchema.pre("save",function(next){
  // get the current date
  var currentDate = new Date();
  this.updated_at = currentDate;

  
  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;
  if (this.isModified('asigned') && this.asigned == true){
    this.asigned_at = currentDate;
    this.lastCall = currentDate;
  }
	next()
});



// the schema is useless so far
// we need to create a model using it
var Did = mongoose.model('Did', didSchema);

// make this available to our users in our Node applications
module.exports = Did;