var ari = require('ari-client');
var util = require('util');

ari.connect('http://localhost:8088', 'ndcg9105', 'Melany90', clientLoaded);

// handler for client being loaded
function clientLoaded (err, client) {
  if (err) {
    throw err;
  }

  client.channels.list(function(err, channels) {
    if (!channels.length) {
      console.log('No channels currently :-(');
    } else {
      console.log('Current channels:');
      channels.forEach(function(channel) {
        console.log(channel.name);
      });
    }
  });

  // handler for StasisStart event
  function stasisStart(event, channel) {
    console.log(util.format(
        'Channel %s has entered the application', channel.name));

    // use keys on event since channel will also contain channel operations
    Object.keys(event.channel).forEach(function(key) {
      console.log(util.format('%s: %s', key, JSON.stringify(channel[key])));
    });

    var playback = client.Playback();
    channel.play({media: 'sound:lots-o-monkeys'},
                  playback, function(err, newPlayback) {
      if (err) {
        throw err;
      }
    });
    playback.on('PlaybackFinished', playbackFinished);
    function playbackFinished(event, completedPlayback) {
      console.log(util.format(
          'Monkeys successfully vanquished %s; hanging them up',
          channel.name));
      channel.hangup(function(err) {
        if (err) {
          throw err;
        }
      });
    }
  }

  // handler for StasisEnd event
  function stasisEnd(event, channel) {
    console.log(util.format(
        'Channel %s has left the application', channel.name));
  }

  client.on('StasisStart', stasisStart);
  client.on('StasisEnd', stasisEnd);

  client.start('did-api');
};