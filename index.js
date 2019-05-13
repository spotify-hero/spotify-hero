var keysSpotify = require('./secu.json');
/**
 * TC Hero : Spotify API testpage
 */
var express       = require('express');
var request       = require('request');
//var cors        = require('cors');                      // not-necessary
var cookieParser  = require('cookie-parser');             // login is kept via a cookie
var querystring   = require('querystring');               // stringify json dictionnaries to make requests
/**
 *  OSU Parser part
 */
var fs = require('fs')
var osuParser = require("./osuParser")

/**
 * API credentials from environment variables
 */
var client_id     = keysSpotify.cliend_id;
var client_secret = keysSpotify.client_secret;
var redirect_uri  = keysSpotify.redirect_uri;


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';
var app = express();
app.use(express.static(__dirname + '/public'))
   .use(cookieParser());                            // nécessaire au bon fonctionnement
//   .use(cors())


app.get('/game', function(req, res) {
  res.status(200).sendFile(__dirname + '/public/game.html');
});

app.get('/osu', function(req, res) {
  let textByLine = fs.readFileSync(__dirname + "/osu/map.osu").toString('utf-8').split('\n')
  res.end(osuParser.parser(textByLine));

});

app.get('/music', function(req, res) {
  res.sendFile(__dirname + '/osu/music.mp3');
});

app.get('/', function(req, res) {
  res.status(200).sendFile(__dirname + '/public/index.html');
});

app.get('/spotify', function(req, res) {
  res.status(200).sendFile(__dirname + '/public/spotify.html');
});

app.get('/login', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
//  user-read-recently-played user-top-read user-library-modify user-library-read playlist-read-private playlist-modify-public playlist-modify-private playlist-read-collaborative user-read-email user-read-birthdate user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming user-follow-read user-follow-modify
//  var scope = 'user-read-private user-read-email';
  var scope = 'user-read-recently-played user-top-read user-library-modify user-library-read playlist-read-private playlist-modify-public playlist-modify-private playlist-read-collaborative user-read-email user-read-birthdate user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming user-follow-read user-follow-modify';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});



app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('spotify/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

/*        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });*/

        // we can also pass the token to the browser to make requests from there
        res.redirect('spotify/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});



app.get('/refresh_token', function(req, res) {
  // requesting access token from refresh token

  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});



//console.log('Listening on 8888');
app.listen(8888, function() {
  console.log('Listening on port 8888');
});
