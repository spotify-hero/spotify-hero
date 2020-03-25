import jquery from './jquery.min';
import { getQueryParams } from './functions';

export default class SpotifyAPI {

  // Demande un nouvel acces_token (valable 1h seulement) grace au refresh token
  refresh() {
    var params = getQueryParams();

    if (params.error) {
      alert('There was an error during the authentication');
    } else {

      jquery.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': params.refresh_token
        }
      }).done(function(data) {

          var field = document.getElementById('oauth-access');
          if (field != null) {
            field.value = data.access_token;
          } else {
            console.log('refresh: Could not write in oauth-access')
          }
        });
    }
  }

  pause(access_token) {
    jquery.ajax({
      type: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      data : "",
      success: function(response) {
        console.log('pause() successfully executed');
      }
    });
    this.updateCurrentPlaying(access_token);
  }

  resume(access_token) {
    jquery.ajax({
      type: 'PUT',
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      data : "",
      success: (res) => {
        console.log('resume() successfully executed');
      },
      fail: (res) => {
        console.error('resume() failed :');
        console.error(res.responseText);
      }
    });
    this.updateCurrentPlaying(access_token);
  }

  previous(access_token) {
    jquery.ajax({
      type: 'POST',
      url: 'https://api.spotify.com/v1/me/player/previous',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      data : "",
      success: function(response) {
        console.log('previous() successfully executed');
      }
    });
    this.updateCurrentPlaying(access_token);
  }

  updateCurrentPlaying(access_token) {
    setTimeout(function() {
      jquery.ajax({
        type: 'GET',
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          console.log(response);
        }
      });
    }, 1000);
  }

  next(access_token) {
    jquery.ajax({
      type: 'POST',
      url: 'https://api.spotify.com/v1/me/player/next',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      data : "",
      success: function(response) {
        console.log('next() successfully executed');
      }
    });
    this.updateCurrentPlaying(access_token);
  }

  play(access_token, uri, device_id) {

    jquery.ajax({
      type: 'PUT',
      url: ((device_id)?'https://api.spotify.com/v1/me/player/play?device_id'+device_id:'https://api.spotify.com/v1/me/player/play'),
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      data : '{"uris": ["'+uri+'"]}',
      success: function(response) {
        console.log('play() successfully executed');
      },
      error: function(response) {
        console.error('play() failed');

        if (response && response.responseJSON.error.reason === "NO_ACTIVE_DEVICE" ) {
          alert('Spotify not playing 😭 ?\nJust play a song in Spotify and refresh this tab 💁‍♀️');
          window.open('https://open.spotify.com/', '_blank');
        }
      }
    });
    this.updateCurrentPlaying(access_token);
  }

  searchOne(uri, access_token) {
    jquery.ajax({
      type: 'GET',
      url: 'https://api.spotify.com/v1/tracks/'+uri,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        console.log('searchOne() successfully executed');

        var inserts = [];
        inserts[0] = {
          "TrackURI" : response.uri,
          "Trackname" : response.name,
          "Trackartist" : response.artists[0].name,
          "Trackcover" : response.album.images[0].url,
          "Trackdelay" : 0,
          "OSUfile" : 'undefined'
        };

        jquery.ajax({
          type: 'POST',
          url: '/database/track',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(inserts),
          success: function(res) {
            console.log("Successfully inserted into Track :");
            console.log(inserts);
          },
          error: function(res) {
            console.error("Could not insert into Track :");
            console.error(inserts);
          }
        });

      }
    });
  }


  search(id, access_token) {

    var keyword = document.getElementById(id).value;
    var BASE_URL = 'https://api.spotify.com/v1/search?';
    var FETCH_URL = BASE_URL + 'q=' + keyword + '&type=artist&limit=1';
    var ALBUM_URL = 'https://api.spotify.com/v1/artists/';

    var myOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    };

    fetch(FETCH_URL, myOptions)

    .then(response => response.json())
      .then(json => {
        var artist = json.artists.items[0];
        FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=FR&`
        fetch(FETCH_URL, myOptions)

        .then(response => response.json())
        .then(json => {
          var { tracks } = json;
          console.log(tracks);

          // create album images
          for (var i=0; i<5; i++) {
            var ele = document.createElement("img");
            ele.src = tracks[i].album.images[0].url;
            ele.style="margin: 10px"
/*            ele.onclick = function jouer(album_uri) {

              jquery.ajax({
                type: 'PUT',
                url: 'https://api.spotify.com/v1/me/player/play',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                data : '{"context_uri": "'+album_uri+'"}',
                complete: function(response) {
                  //console.log(response);
                }
              });
              console.log('onclick AJAX request executed');
            }(tracks[i].album.uri);*/
            document.getElementById("pochettes").appendChild(ele);
          }

          var inserts = [];
          for (var i=0; i<5; i++) {
            inserts[i] = {
              "TrackURI" : tracks[i].uri,
              "Trackname" : tracks[i].name,
              "Trackartist" : tracks[i].artists[0].name,
              "Trackcover" : tracks[i].album.images[2].url,
              "Trackdelay" : 0,
              "OSUfile" : 'undefined'
            };
          }

          jquery.ajax({
            type: 'POST',
            url: '/database/track',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(inserts),
            success: function(res) {
              console.log("Successfully inserted into Track :");
              console.log(inserts);
            },
            error: function(res) {
              console.error("Could not insert into Track :");
              console.error(inserts);
            }
          });
        });
    });

/*    setTimeout(function() {
      jquery.ajax({
        type: 'GET',
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          //console.log(response);
          document.getElementById('playing_album').src = response.item.album.images[0].url;
          document.getElementById('is_playing').innerHTML = response.is_playing;
          document.getElementById('playing_title').innerHTML = response.item.name;
          document.getElementById('playing_id').innerHTML = response.item.id;
          document.getElementById('playing_artist').innerHTML = response.item.artists[0].name;
          document.getElementById('playing_progress').innerHTML = response.progress_ms;
          document.getElementById('playing_populariry').innerHTML = response.item.popularity;
        }
      });
    }, 1000);*/
  }
}