var express = require("express");
var	app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/did');
var auth = require("./helpers/auth.js");
var bcrypt = require("bcrypt");
var ari = require('ari-client');
var util = require('util');

var routes = require("./routes/index"),
  views = require("./routes/views/index")
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	exphbs  = require('express-handlebars'),
	path = require("path")



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(auth.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({extname:'html', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.use('/', views);
app.use('/api', routes);

app.listen(3000, function () {
  console.log('app listening on port 3000!');
  ari.connect('http://localhost:8088', 'ndcg9105', 'Melany90', clientLoaded);

});


 
 
// handler for client being loaded
function clientLoaded (err, client) {
  if (err) {
    throw err;
  }
  var bridge = null;
  var playback = null;
  client.bridges.create({type: 'mixing'}, function(err, newBridge) {
    if (err) {
      throw err;
    }
    bridge = newBridge;
    console.log(util.format('Created bridge %s', bridge.id));
  });
 
  // handler for StasisStart event
  function stasisStart(event, channel) {
    console.log(util.format(
          'Monkeys! Attack %s!', channel.name));

    //adding channel to bridge
    playback = client.Playback();

    bridge.addChannel({channel: channel.id}, function(err) {
      if (err) {
        throw err;
      }
 
      bridge.play({media: 'sound:lots-o-monkeys'},
                  playback, function(err, newPlayback) {
        if (err) {
          throw err;
        }
      });
    });
 
    // channel.play({media: 'sound:lots-o-monkeys'},
    //               playback, function(err, newPlayback) {
    //   if (err) {
    //     throw err;
    //   }
    // });
    playback.on('PlaybackFinished', playbackFinished);
 
    function playbackFinished(event, completedPlayback) {
      console.log(util.format(
          'Monkeys successfully vanquished %s; hanging them up',
          channel.name));
        bridge.play({media: 'sound:lots-o-monkeys'},
                    playback, function(err, newPlayback) {
          if (err) {
            throw err;
          }
        });
        
    }
  }
 
  // handler for StasisEnd event
  function stasisEnd(event, channel) {
    playback.stop();
    bridge.removeChannel(channel,function(err){
      console.log(err,"leaving channel")
    })
    console.log(util.format(
          'Channel %s just left our application', channel.name));
  }
 
  client.on('StasisStart', stasisStart);
  client.on('StasisEnd', stasisEnd);
 
  client.start('did-api');
}

// var clientLoaded = (err,client) => {
//   var playback = client.Playback();

//   if (err) {
//     throw err;
//   }
  

//   client.channels.list(function(err, channels) {
//     if (!channels.length) {
//       console.log('No channels currently :-(');
//     } else {
//       console.log('Current channels:');
//       channels.forEach(function(channel) {
//         console.log(channel);
//       });
//     }
//   });
//   client.on('StasisStart', stasisStart);
//   client.on('StasisEnd', stasisEnd);
//   client.start('did-api');

//   function stasisStart(event, channel) {
//     console.log(util.format(
//         'Channel %s has entered the application', channel.name));

//     // use keys on event since channel will also contain channel operations
//     Object.keys(event.channel).forEach(function(key) {
//       console.log(util.format('%s: %s', key, JSON.stringify(channel[key])));
//     });

//     channel.play({media: 'sound:lots-o-monkeys'},playback, function(err, newPlayback) {
//       if (err) {
//         throw err;
//       }
//     });

//     playback.on('PlaybackFinished', function(event, completedPlayback) {
//       console.log(util.format(
//         'Monkeys successfully vanquished %s; hanging them up',
//         channel.name));
//         channel.play({media: 'sound:lots-o-monkeys'},playback, function(err, newPlayback) {
//           if (err) {
//             throw err;
//           }
//         });
       
//     });

//   }

//   function stasisEnd(event, channel) {
//     console.log("end")
//   }
// }


// handler for StasisStart event




// handler for StasisEnd event

