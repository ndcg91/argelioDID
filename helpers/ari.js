var ari = require('ari-client'),
	Calls = require('./../models/calls'),
	Users = require('./../models/users'),
 	Phones = require('./../models/did'),
 	util = require('util');


module.exports = {
	initializeAri:  () => {
		ari.connect('http://localhost:8088', 'ndcg9105', 'Melany90', clientLoaded);
	}
}

var ariClient = null;

// handler for client being loaded
function clientLoaded (err, client) {
  if (err) {
    throw err;
  }
  ariClient = client;

  client.on('StasisStart', stasisStart);
  client.on('StasisEnd', stasisEnd);
  client.start('did-api');
}


function stasisEnd(event, channel) {
    console.log(util.format(
          'Channel %s just left our application', channel.name));
    Calls.findOne({channel: channel.name},function(err,call){
      call.endTime = new Date()
      call.save();
    })
  }


function stasisStart(event, channel) {
    var bridge = null;
    
    console.log(util.format('Monkeys! Attack %s!', channel.toString()));
    //create bridge , if we dont create the bridte the app breaks when the user hang up
    ariClient.bridges.create({type: 'mixing'}, function(err, newBridge) {
      if (err) {
        throw err;
      }
      bridge = newBridge;
      bridge.addChannel({channel: channel.id}, function(err) {
        if (err) {
          throw err;
        }
        
        bridge.startMoh(function(err){
          if (!err){
            //we create the call only required parameter is number and channel name
            //change number to channel.destination 123 is for testing pruposes 
            let call = new Calls({
              number: 123,
              channel: channel.name
            })
            call.save(function(err,savedCall){
            	if (err) {
            		console.log(err);
            	}
            	console.log("saved call", savedCall)
            	//assign the call to a user 
            	//find the document with the number
            	Phones.findOne({number: 123},function(err,number){
            		
            		if (!err && number){
            			number.lastCall = new Date()
	            		number.save(function(err,savedNumber){
	            			Users.findOne({numbers: savedNumber._id},function(err,user){
	            				user.calls.push(savedCall._id)
	            				user.save();
            				})
	            		})
            			
            		}
            	})
            });

            
          }
          else throw err
        })
      });
    });

  }