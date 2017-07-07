// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create a schema
var tarifSchema = new Schema({
  description: String,
  condition:String,
  price_per_minute: Number,
  billing_terms: Number, // frecuencia de pago, el cliente no puede cambiar el billings terms
  visible: {type: Boolean, default: false},
  created_at: Date,
  updated_at: Date
});

tarifSchema.pre("save",function(next){
  // get the current date
  var currentDate = new Date();

  
  // if created_at doesn't exist, add to that field
  this.updated_at = currentDate

  if (!this.created_at)
    this.created_at = currentDate;
  

  next()

});



// the schema is useless so far
// we need to create a model using it
var Tarif = mongoose.model('Tarif', tarifSchema);

// make this available to our users in our Node applications
module.exports = Tarif;