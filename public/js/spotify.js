// import librairies
import jquery from '../lib/jquery.min';
import Handlebars from '../lib/handlebars.min';
import Spotify from '../lib/spotify-player.min';
import SpotifyAPI from '../lib/SpotifyAPI';
import { getQueryParams, copyClipboard } from '../lib/functions';

import '../css/spotify.scss';

document.addEventListener("DOMContentLoaded", () => {

  var params = getQueryParams();
  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  /********************************************
  *  linking buttons to SpotifyAPI functions  *
  *********************************************/
  var spAPI = new SpotifyAPI();
  document.getElementById("button-pause").onclick = (()=>{spAPI.pause(access_token)});
  document.getElementById("button-play").onclick = (()=>{spAPI.resume(access_token)});
  document.getElementById("button-previous").onclick = (()=>{spAPI.previous(access_token)});
  document.getElementById("button-next").onclick = (()=>{spAPI.next(access_token)});
  document.getElementById("keywords").onchange = (()=>{spAPI.search('keywords', access_token)});
  document.getElementById("keywords_button").onclick = (()=>{spAPI.search('keywords', access_token)});
  document.getElementById("trackID").onchange = (()=>{spAPI.searchOne('trackID', access_token)});
  document.getElementById("trackID_button").onclick = (()=>{spAPI.searchOne('trackID', access_token)});


  document.getElementById('button-database').innerHTML = '<a href="/select?table=Track+Score&access_token='+access_token+'">Part 2 : Database</a>';


  /********************************************
  *         templating with Handlebars        *
  *********************************************/
  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      userProfileTemplate = Handlebars.compile(userProfileSource),
      userProfilePlaceholder = document.getElementById('user-profile');

  var cpTemplate = Handlebars.compile(document.getElementById('currently-playing-template').innerHTML),
      cpPlaceholder = document.getElementById('currently-playing');

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
              console.log('spotify.html:305 - Could not write in oauth-access')
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
