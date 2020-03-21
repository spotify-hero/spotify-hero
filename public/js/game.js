import * as THREE from '../lib/three.min';
import PointerLockControls from '../lib/PointerLockControls';
import OrbitControls from '../lib/OrbitControls';
import jquery from '../lib/jquery.min';
import Key from '../lib/key';
import GameNotes from '../lib/game_notes';
import GameView from '../lib/game_view';
import Instructions from '../lib/instructions';
import SpotifyAPI from '../lib/SpotifyAPI';
import { getQueryParams, copyClipboard } from '../lib/functions';


import '../css/game.scss';


document.addEventListener("DOMContentLoaded", () => {
  let game = new Game();
});

class Game {
  constructor() {
    this.noteInterval = 237.8;
    this.musicDelay = 1250;
    this.key = new Key();
    this.instructions = new Instructions();
    this.started = false;
    this.beatmap = [];
    this.spAPI = new SpotifyAPI();
    var spotifyAPI = this.spAPI;

    this.audioMode = getQueryParams().audio;

    this.gameStartEl = document.getElementsByClassName('start')[0];
    this.createGameView();
    this.setupGame();


    document.getElementsByClassName('retry-pause')[0].onclick = function(){
      document.location.reload(false);
    }

    document.getElementsByClassName('record-pause')[0].onclick = function(){
      window.location.search += '&mode=record';
    }

    document.getElementsByClassName('select-pause')[0].onclick = function(){
      window.location.href = '/select?table=track&access_token='+getQueryParams().access_token;
    }

    document.getElementsByClassName('record-pause')[0].onclick = function(){
      window.location.search += '&mode=record';
    }

    document.getElementsByClassName('save-score')[0].onclick = function(){
      var scoreTosave = document.getElementsByClassName('score')[0].innerHTML
      scoreTosave = scoreTosave.replace( /^\D+/g, '');

/*      inserts = [];
      inserts.push({
        'userURI' : getQueryParams().userURI,
        'Timestamp' : '',
        'ScoreValue' : scoreTosave,
        'TrackURI' : getQueryParams().TrackURI
      });

      jquery.ajax({
        type: 'POST',
        url: '/database/score',
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
      });*/
    }
    
    document.getElementsByClassName('open-pause')[0].onclick = function(){
      document.getElementsByClassName('pause')[0].className = "pause";
      var access_token = getQueryParams().access_token;
      spotifyAPI.pause(access_token);
      this.started = false;
    }

  }

  setupGame(){
    //il faut charger la musique sans la jouer + télécharger map
    //load musique
    this.getOsuFile();
    console.log("audio mode : " + this.audioMode);

    window.addEventListener("keydown", this.hitAToStart.bind(this));
    window.addEventListener("touchstart", (e)=>{
      if (!this.started) {
        this.startGame();
      }
    })
    
  }

  startGame() {
    // Mode enregistrement !!!!
    if (getQueryParams().mode === 'record') {
      this.gameView.setStartTimeRecord();
      this.gameView.addNoteRecord();
    }else{
      this.gameView.addMovingNotes(this.noteInterval, this.beatmap, 0);
    }

    let musicDelay = Math.abs(getQueryParams().Trackdelay);

    if (this.audioMode == "track"){

      console.log("cookie");
      console.log("uri" + getQueryParams().TrackURI);

      //code before the pause
      var spotifyAPI = this.spAPI;
      setTimeout(function(){
        var uri = getQueryParams().TrackURI;
        if (uri) {
          let access_token = getQueryParams().access_token;
          console.log('send request to play '+uri);
          spotifyAPI.play(access_token, getQueryParams().TrackURI, null);
        } else {
          console.error('Cannot play : no spotify URI specified !')
        }
      }, musicDelay);
    }

    if (this.audioMode == "mp3"){
      console.log("mp3 ! ");
      console.log(getQueryParams().Filename);

      jquery.ajax({
        async: false,
        type:'GET',
        url: '/mp3/'+getQueryParams().Filename,
        data: '',
        success: function(response) {
          console.log('Successfully got file from server.');
          console.log(response);

          let audio = new Audio();
          audio.src = 'data:audio/mp3;base64,' + response.fileContent;
          audio.load();
          audio.play();
        },
        error: function(response) {
          console.log('ERROR : Could not get file from server !');
        }
      })  
    }

    this.gameStartEl.className = "start hidden";
    this.started = true;
  }


  hitAToStart(e) {
    if (!this.started) {
      if (e.keyCode === 97 || e.keyCode === 65) {
        this.startGame();
      }
    }

    if (e.keyCode == 27){
      console.log("vous avez appuyé sur échap")
      document.getElementsByClassName('pause')[0].className="pause"
      var access_token = getQueryParams().access_token;
      this.gameView.isPlay = false;
      this.spAPI.pause(access_token);
      this.started = false;
    } else if (e.keyCode == 122 || e.keyCode == 90) {

      if (getQueryParams().mode === 'record') {
        var filename = getQueryParams().Trackartist.split(' ').join('');
        filename += '_'+getQueryParams().Trackname.split(' ').join('')+'.osu';
        this.sendOsuFile(filename, this.gameView.recordMap);
        console.log("Recorded beatmap sent to server");
      } else {
        window.location.replace("/select?table=Track"+"&userURI="+getQueryParams().userURI+"&access_token="+getQueryParams().access_token);
      }
      
    }
  }


  getOsuFile(){
    let osuData;
    // AJAX request
    jquery.ajax({
      async: false,
      type:'GET',
      url: '/osu/'+getQueryParams().OSUfile,
      data: '',
      success: function(response) {
        osuData = JSON.parse(response);
        console.log('Successfully got file from server.');
      },
      error: function(response) {
        console.log('ERROR : Could not get file from server !');
      }
    })

    this.beatmap = osuData;
  }

  sendOsuFile(filename, recordMap){
    // AJAX request
    jquery.ajax({
      async: false,
      type:'POST',
      url: '/osu/'+filename,
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify(recordMap),
      success: function(response) {

        jquery.ajax({
          async: false,
          type:'PUT',
          url: '/database/track/'+getQueryParams().TrackURI,
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify({0: "OSUfile = '"+filename+"'"}),
          success: function(response) {
            console.log('Chained AJAX successfull !');
            window.location.replace("/select?table=Track&access_token="+getQueryParams().access_token);
          },
          error: function(response) {
            document.location.reload(false);
          }
        });
      },
      error: function(response) {
          document.location.reload(false);
      }
    })
    
  }

  createGameView() {
    // SCENE SIZE
    let width = window.innerWidth,
      height = window.innerHeight;

    // CAMERA ATTRIBUTE
    let viewAngle = 75,
      aspect = width / height,
      near = 0.1,
      far = 10000;

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(
      viewAngle,
      aspect,
      near,
      far);

    camera.position.z = 150;

    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( width, height );
    document.getElementById('game-canvas').appendChild( renderer.domElement );

    this.gameView = new GameView(
      renderer, camera, scene, this.key, this.musicDelay
    );
    this.gameView.setup();
  }
}
