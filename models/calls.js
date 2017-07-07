// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Dids = require("./did");
// create a schema
var callSchema = new Schema({
  number: String, //did id
  channel:{type:String, unique: true},
  duration: Number,
  starTime: Date,
  endTime: Date,
  belongs_to: String // client id
});

callSchema.pre("save",function(next){
  // get the current date
  var currentDate = new Date();

  
  // if created_at doesn't exist, add to that field
  if (!this.starTime)
    this.starTime = currentDate;

  if(this.endTime){
    this.duration = Math.floor(
        (this.endTime.getTime() - this.starTime.getTime()) / 1000 
      )
    Dids.findByIdAndUpdate(this.number,{$inc:{total_seconds: this.duration}})
      .catch(err => console.log(err))
  }
  next()

});



// the schema is useless so far
// we need to create a model using it
var Call = mongoose.model('Call', callSchema);

// make this available to our users in our Node applications
module.exports = Call;