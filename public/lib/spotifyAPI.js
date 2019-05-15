import jquery from '../vendor/jquery.min';
import {getHashParams, copyClipboard} from './functions';

class spotifyAPI {
  hello() {
    jquery.ajax();
    console.log("elllooooo");
  }

  // Demande un nouvel acces_token (valable 1h seulement) grace au refresh token
  refresh() {
    var params = getHashParams();

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

  pause() {
    var params = getHashParams();
    var access_token = params.access_token;

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
  }

  previous() {
    var params = getHashParams();
    var access_token = params.access_token;

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

  setTimeout(function() {
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
  }, 1000);
  }

  next() {
    var params = getHashParams();
    var access_token = params.access_token;

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

  setTimeout(function() {
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
  }, 1000);
  }

  play(uri, device_id) {
    var params = getHashParams();
    var access_token = params.access_token;

    if (typeof uri === 'undefined' || typeof device_id === 'undefined') {
      jquery.ajax({
        type: 'PUT',
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        data : "",
        success: function(response) {
          console.log('play() successfully executed');
        }
      });
    } else {
      console.log('Make a precise request');
    }
  }

  search() {

    var keyword = document.getElementById('keywords').value;
    var BASE_URL = 'https://api.spotify.com/v1/search?';
    var FETCH_URL = BASE_URL + 'q=' + keyword + '&type=artist&limit=1';
    var ALBUM_URL = 'https://api.spotify.com/v1/artists/';

    var params = getHashParams();
    var access_token = params.access_token;

    var myOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    };

    fetch(FETCH_URL, myOptions)
    .then(response => response.json())

      .then(json => {

        //console.log(json);
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
            ele.src = tracks[i].album.images[2].url;
            ele.style="margin: 10px"
            ele.onclick = function jouer(album_uri) {

              var params = getHashParams();
              var access_token = params.access_token;

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
            }(tracks[i].album.uri);
            document.getElementById("pochettes").appendChild(ele);
          }
        });
      });


    setTimeout(function() {
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
    }, 1000);
  }
}

export default spotifyAPI;