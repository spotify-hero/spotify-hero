// import librairies
import jquery from '../vendor/jquery.min';
import Handlebars from '../vendor/handlebars.min';
import Spotify from '../vendor/spotify-player.min';

// import custom functions
import SpotifyAPI from './SpotifyAPI';
import {getHashParams, copyClipboard} from './functions';


document.addEventListener("DOMContentLoaded", () => {

  /********************************************
  *  linking buttons to SpotifyAPI functions  *
  *********************************************/
  var spAPI = new SpotifyAPI();
  document.getElementById("button-pause").onclick = spAPI.pause;
  document.getElementById("button-play").onclick = spAPI.resume;
  document.getElementById("button-previous").onclick = spAPI.previous;
  document.getElementById("button-next").onclick = spAPI.next;
  document.getElementById("keywords").onchange = spAPI.search;
  document.getElementById("keywords_button").onclick = spAPI.search;


  /********************************************
  *         templating with Handlebars        *
  *********************************************/
  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      userProfileTemplate = Handlebars.compile(userProfileSource),
      userProfilePlaceholder = document.getElementById('user-profile');

  var cpTemplate = Handlebars.compile(document.getElementById('currently-playing-template').innerHTML),
      cpPlaceholder = document.getElementById('currently-playing');

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {

    if (access_token) {

      jquery.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            userProfilePlaceholder.innerHTML = userProfileTemplate(response);

            var field = document.getElementById('oauth-access');
            if (field != null) {
              field.value = access_token;
            } else {
              console.log('index.html:305 - Could not write in oauth-access')
            }

            jquery('#login').hide();
            jquery('#loggedin').show();


            jquery.ajax({
                type: 'GET',
                url: 'https://api.spotify.com/v1/me/player/currently-playing',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                  //console.log(JSON.stringify(response));
                  cpPlaceholder.innerHTML = cpTemplate(response);
                }
            });
          }
      });

    } else {
        // render initial screen
        jquery('#login').show();
        jquery('#loggedin').hide();
    }
  }

  console.log("spotify_main.js successfully loaded");
});
