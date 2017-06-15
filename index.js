var express = require("express");
var	app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/argelio');
var auth = require("./helpers/auth.js");
var bcrypt = require("bcrypt");
var ari = require('ari-client');
var util = require('util');

var routes = require("./routes/index"),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	exphbs  = require('express-handlebars'),
	path = require("path")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(auth.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


app.listen(3000, function () {
  console.log('app listening on port 3000!');
  ari.connect('http://localhost:8088', 'ndcg9105', 'Melany90', clientLoaded);

});

var playback;

var clientLoaded = (err,client) => {
  playback = client.Playback();

  if (err) {
    throw err;
  }
  client.on('StasisStart', stasisStart);
  client.on('StasisEnd', stasisEnd);
  client.start('did-api');

  client.channels.list(function(err, channels) {
    if (!channels.length) {
      console.log('No channels currently :-(');
    } else {
      console.log('Current channels:');
      channels.forEach(function(channel) {
        console.log(channel);
      });
    }
  });
}

// handler for StasisStart event
var stasisStart = (event, channel) => {
  console.log(util.format(
      'Channel %s has entered the application', channel.name));

  // use keys on event since channel will also contain channel operations
  Object.keys(event.channel).forEach(function(key) {
    console.log(util.format('%s: %s', key, JSON.stringify(channel[key])));
  });

  channel.play({media: 'sound:lots-o-monkeys'},playback, function(err, newPlayback) {
    if (err) {
      throw err;
    }
  });

  playback.on('PlaybackFinished', function(event, completedPlayback) {
    console.log(util.format(
      'Monkeys successfully vanquished %s; hanging them up',
      channel.name));
    if (channel != null){
      channel.hangup(function(err) {
        if (err) {
            console.log(err)
          }
      });
    }
  });

}



// handler for StasisEnd event
var stasisEnd = (event, channel) => {
  console.log(util.format(
      'Channel %s has left the application', channel.name));
}
