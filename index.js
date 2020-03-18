/*
 ______   ______     ______   ______   ______     ______      __  __     ______     ______     ______
/\__  _\ /\  __ \   /\  == \ /\__  _\ /\  __ \   /\  == \    /\ \_\ \   /\  ___\   /\  == \   /\  __ \
\/_/\ \/ \ \  __ \  \ \  _-/ \/_/\ \/ \ \  __ \  \ \  _-/    \ \  __ \  \ \  __\   \ \  __<   \ \ \/\ \
   \ \_\  \ \_\ \_\  \ \_\      \ \_\  \ \_\ \_\  \ \_\       \ \_\ \_\  \ \_____\  \ \_\ \_\  \ \_____\
    \/_/   \/_/\/_/   \/_/       \/_/   \/_/\/_/   \/_/        \/_/\/_/   \/_____/   \/_/ /_/   \/_____/

@version 0.1.0
@license CC-BY-NC-SA 4.0
@authors Cécile POUPON - Antoine BALLIET - Gabriel FORIEN
*/


/*************************************
*            depedencies
**************************************/
var express       = require('express');
var request       = require('request');
//var cors        = require('cors');                      // not-necessary
var cookieParser  = require('cookie-parser');             // login is kept via a cookie
var querystring   = require('querystring');               // stringify json dictionnaries to make requests
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 8888;

// OSU Parser part
var fs = require('fs');
var osuParser = require("./osuParser");
var files = fs.readdirSync('./osu');

var sqlite3 = require('sqlite3').verbose();
var dbHandler = require('./dbHandler');

// API credentials from secured file
var client_id     = process.env.client_id;
var client_secret = process.env.client_secret;
var redirect_uri  = process.env.redirect_uri;

console.log("client id : " + client_id);
console.log("redirect_uri : " + redirect_uri);


// Initiate server, static folder is /public, load cookieParser, connect to db
var stateKey = 'spotify_auth_state';
var app = express();
app.use(express.static(__dirname + '/public'))
   .use(cookieParser())
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }));
//   .use(cors())
process.setMaxListeners(0);
var db = new sqlite3.Database('./main.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
});

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};



/*************************************
*            routes definitions
**************************************/
app.get('/', function(req, res) {
  res.status(200).sendFile(__dirname + '/public/index.html');
});

app.get('/game', function(req, res) {
  res.status(200).sendFile(__dirname + '/public/game.html');
});

app.get('/spotify', function(req, res) {
  res.status(200).sendFile(__dirname + '/public/spotify.html');
  //res.redirect('/login?from=index');
});

app.get('/login', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
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

app.get('/select', function(req, res) {
  res.status(200).sendFile(__dirname + '/public/select.html');
});

/****************************************************
*        callbacks and JSON-feeding
*****************************************************/
app.get('/database/:name', function(req, res) {
  console.log('DB request : GET '+req.params.name);
  dbHandler.selectAll(db, req.params.name, function(data) {
      res.end(JSON.stringify(data));
  });
  //db.close();
});

app.post('/database/:name', function(req, res) {
  console.log('DB request : POST to '+req.params.name);
  console.log(req.body);
  dbHandler.insertInto(db, req.params.name, req.body, console.log);
  res.status(200).end(JSON.stringify(req.body));
});

app.put('/database/:name/:primary_key', function(req, res) {
  console.log('DB request : PUT in '+req.params.name +': '+req.body["0"]);
 dbHandler.updateTrackFields(db, req.params.name, req.params.primary_key, req.body["0"], function(data) {
     res.status(200).end(JSON.stringify(data));
  });
  //db.close();
});

/*app.delete('/database/:name/:primary_key', function(req, res) {
  dbHandler.selectAll(db, req.params.name, function(data) {
      res.end(JSON.stringify(data));
  });
  //db.close();
});*/

app.get('/osu/:name', function(req, res) {
  console.log('Request for file: '+req.params.name);
  let filename = __dirname + "/osu/"+req.params.name;
  fs.stat(filename, (err, stat) => {
    if(err == null) {
      let textByLine = fs.readFileSync(__dirname + "/osu/"+req.params.name).toString('utf-8').split('\n');
      res.status(200).end(osuParser.parser(textByLine));
    } else {
      console.log('Error: file not found '+filename);
      res.status(404).end("File not found !");
    }
  });
});

app.post('/osu/:name', function(req, res){
  var recorded = req.body;
  var nom = req.params.name;

  fs.writeFile(__dirname + "/osu/" + nom, "[HitObjects]\n", function (err) {
    if (err) throw err;
    console.log('File '+nom+' was created successfully');
  }); 

  recorded.forEach(element => {
    var newPos = osuParser.convertPosition(element.position)
    let line = newPos +"," + newPos + "," + element.startTime + ",1,0,0:0:0:0:\n"
    fs.appendFile(__dirname + "/osu/" + nom, line, function(err){
      if (err) throw err;
    })
  });
  res.status(200).end("");
})


app.get('/spotify_cb', function(req, res) {
  // requests refresh and access tokens after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('spotify?' +
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

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          if(!error) {
            inserts = [{
              'UserURI': body.uri,
              'Username': body.display_name,
              'Country': body.country,
              'Picture': body.images[0].url
            }];
            dbHandler.insertInto(db, 'User', inserts, ()=> {
              console.log("Inserted into User with success !");
            });
            res.redirect('/select?' +
              querystring.stringify({
                table: "track",
                userURI : body.uri,
                access_token: access_token
              }));
          }
        });

      } else {
        res.redirect('/?' +
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

app.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});
