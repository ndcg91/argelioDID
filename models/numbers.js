// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create a schema
var phoneSchema = new Schema({
  number: String,
  created_at: Date,
  lastCall: Date
});

phoneSchema.pre("save",function(next){
  // get the current date
  var currentDate = new Date();

  
  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;
  

});



// the schema is useless so far
// we need to create a model using it
var Number = mongoose.model('Number', phoneSchema);

// make this available to our users in our Node applications
module.exports = Number;