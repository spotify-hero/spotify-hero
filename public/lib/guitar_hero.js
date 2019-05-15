import Game from "./game";
import jquery from '../vendor/jquery.min';
//import Spotify from '../vendor/spotify-player.min';
import SpotifyAPI from './SpotifyAPI';
import {getHashParams, copyClipboard} from './functions';

document.addEventListener("DOMContentLoaded", () => {
  let game = new Game();
  var spAPI = new SpotifyAPI();
  console.log("Successfully loaded")

  document.getElementsByClassName('close-pause')[0].onclick = function(){
    console.log("retry !!! ")
    document.location.reload(false);
  }
  
  document.getElementById('play_uri').onclick = () => {
    var uri = document.getElementById('input_uri').value;
    var deviceID = document.getElementById('input_device_id').value;
    spAPI.play(uri, deviceID);
  };

});
