// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create a schema
var numberSchema = new Schema({
  number: Number,
  created_at: Date,
  lastCall: Date
});

numberSchema.pre("save",function(next){
  // get the current date
  var currentDate = new Date();

  
  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.starTime = currentDate;
  

});



// the schema is useless so far
// we need to create a model using it
var Number = mongoose.model('Number', numberSchema);

// make this available to our users in our Node applications
module.exports = Number;