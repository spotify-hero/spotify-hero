/*
 ______     ______   ______     ______   __     ______   __  __              __  __     ______     ______     ______    
/\  ___\   /\  == \ /\  __ \   /\__  _\ /\ \   /\  ___\ /\ \_\ \    ______  /\ \_\ \   /\  ___\   /\  == \   /\  __ \   
\ \___  \  \ \  _-/ \ \ \/\ \  \/_/\ \/ \ \ \  \ \  __\ \ \____ \  |\_____\  \ \  __ \  \ \  __\   \ \  __<   \ \ \/\ \  
 \/\_____\  \ \_\    \ \_____\    \ \_\  \ \_\  \ \_\    \/\_____\ \|_____|   \ \_\ \_\  \ \_____\  \ \_\ \_\  \ \_____\ 
  \/_____/   \/_/     \/_____/     \/_/   \/_/   \/_/     \/_____/             \/_/\/_/   \/_____/   \/_/ /_/   \/_____/ 

@version 0.2.0
@license CC-BY-NC-SA 4.0
@authors Antoine BALLIET - Gabriel FORIEN
*/


/*************************************
*            depedencies
**************************************/
var express       = require('express');
var request       = require('request');
var cookieParser  = require('cookie-parser');             // login is kept via a cookie
var querystring   = require('querystring');
var bodyParser    = require('body-parser');
var exphbr        = require('express-handlebars');

const PORT        = process.env.PORT || 8888;

// OSU Parser part
var fs            = require('file-system');
var osuParser     = require("./osuParser");

// database part
var sqlite3       = require('sqlite3').verbose();
var dbHandler     = require('./dbHandler');

// API credentials from secured file
var CLIENT_ID     = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
var REDIRECT_URI  = process.env.REDIRECT_URI;

// Initiate server, static folder is /public, load cookieParser, connect to db
var app = express();
app.use(express.static(__dirname + '/public'))
   .use(cookieParser())
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }));

// Sets our app to use the handlebars engine
var handlebars = exphbr.create({
    defaultLayout: '_TEMPLATE',
    extname      : '.html',
    layoutsDir: __dirname + '/public'
});
app.engine('html', handlebars.engine);
app.set('view engine', 'html');
app.set('views', __dirname + '/public');

process.setMaxListeners(0);
var db = new sqlite3.Database('./main.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
});

// Code taken directly from Spotify Developers website
var stateKey = 'spotify_auth_state';
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};



/*****************************************************
*                routes definitions
******************************************************/
app.get('/', function(req, res) {
  res.render('home', {name: 'home'});
});

app.get('/select', function(req, res) {
    res.render('select', {name: 'select'});
});

app.get('/spotify', function(req, res) {
    res.render('spotify', {name: 'spotify'});
});

app.get('/game', function(req, res) {
  res.status(200).sendFile(__dirname + '/public/game.html');
});


// Taken directly from Spotify Developers website
app.get('/login', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  var scope = 'user-read-recently-played user-top-read user-library-modify user-library-read playlist-read-private playlist-modify-public playlist-modify-private playlist-read-collaborative user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming user-follow-read user-follow-modify';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state
    }));
});

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
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
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
                table: "track mp3",
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

app.get('/refresh_token',  function(req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
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


/****************************************************
*             callbacks and JSON-feeding
*****************************************************/
app.get('/:type/:name', function(req, res) {

  console.log('GET /'+req.params.type+'/'+req.params.name);
  switch (req.params.type) {

    // Here we call dbHandler.js
    case 'database':
      dbHandler.selectAll(db, req.params.name, function(data) {
          res.end(JSON.stringify(data));
      });
      //db.close();
      break;

    // Here we just load a file with fs and send it
    case 'osu':
    case 'artwork':
    case 'mp3':
      let filename = __dirname + "/"+ req.params.type +"/"+req.params.name;

      fs.stat(filename, (err, stat) => {
        if (!err) {

          // OSU file : we parse it with osuParser.js before sending
          if (req.params.type == 'osu') {
            let textByLine = fs.readFileSync(filename).toString('utf-8').split('\n');
            res.status(200).end(osuParser.parser(textByLine));

          // PNG file : just send it
          } else if (req.params.type == 'artwork') {
            res.status(200).sendFile(filename);

          // MP3 file : load the binary and send it in base64 
          } else if (req.params.type == 'mp3') {
            fs.readFile(filename, function(err, file) {
              let base64File = Buffer.from(file, 'binary').toString('base64');
              res.json({'fileContent': base64File});
            });
          }
        } else {
          console.log('Error: file not found '+filename);
          res.status(404).end("File not found !");
        }
      });
      break;

      default:
        res.status(404).send('404: Page not found');
  }
});



app.post('/:type/:name', function(req, res) {

  console.log('POST /'+req.params.type+'/'+req.params.name);
  switch (req.params.type) {

    // Here we call dbHandler.js
    case 'database':
      dbHandler.insertInto(db, req.params.name, req.body, console.log);
      res.status(200).end(JSON.stringify(req.body));
      //db.close();
      break;

    // Here we just load a file with fs and send it
    case 'osu':
      var recorded = req.body;
      var nom = req.params.name;

      fs.writeFile(__dirname + "/osu/" + nom, "[HitObjects]\n", function (err) {
        if (err) throw err;
        console.log('File '+nom+' was created successfully');
      }); 

      recorded.forEach(element => {
        var newPos = osuParser.convertPosition(element.position)
        let line = newPos +"," + newPos + "," + element.startTime + ",1,0," + element.duration + ":0:0:0:\n"
        fs.appendFile(__dirname + "/osu/" + nom, line, function(err){
          if (err) throw err;
        })
      });
      res.status(200).end("");
      break;

    case 'artwork':
    case 'mp3':
    default:
      res.status(404).send('404: Page not found');
  }
});


app.put('/database/:name/:primary_key', function(req, res) {
  console.log('PUT update /database/'+req.params.name+'/'+req.params.primary_key+' with value '+req.body["0"]);
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


// 404 Error : this route must remain on bottom and no dynamic route must be defined before
app.use(function(req, res) {
  res.status(404).send('404: Page not found');
});

// 500 Error : this route must remain on bottom and no dynamic route must be defined before
app.use(function(error, req, res, next) {
  res.status(500).send('500: Internal server error');
});

module.exports = app.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});
