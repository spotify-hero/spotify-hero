import * as THREE from '../vendor/three.min';
import PointerLockControls from '../vendor/PointerLockControls.js';
import OrbitControls from '../vendor/OrbitControls.js';
import jquery from '../vendor/jquery.min';

import Key from './key';
import GameNotes from './game_notes';
import GameView from './game_view';
import Instructions from './instructions';
import SpotifyAPI from './SpotifyAPI';
import {getQueryParams, copyClipboard} from './functions';


class Game {
  constructor() {
    this.noteInterval = 237.8;
    this.musicDelay = 1250;
    this.key = new Key();
    this.instructions = new Instructions();
    this.started = false;
    this.beatmap = [];

    document.getElementsByClassName('retry-pause')[0].onclick = function(){
      console.log("retry !!! ")
      document.location.reload(false);
    }

    document.getElementsByClassName('record-pause')[0].onclick = function(){
      console.log("recordMode");
    }

    document.getElementsByClassName('select-pause')[0].onclick = function(){
      console.log("select !!! ")
      window.location.href = '/select';
    }

    this.spAPI = new SpotifyAPI();

    this.gameStartEl = document.getElementsByClassName('start')[0];
    this.createGameView();
    this.setupGame();
    
  }

  setupGame(){
    //il faut charger la musique sans la jouer + télécharger map
    //load musique
    this.getOsuFile();

    window.addEventListener("keydown", this.hitAToStart.bind(this));
    window.addEventListener("touchstart", (e)=>{
      if (!this.started) {
        this.startGame();
      }
    })
    
  }

  startGame() {
    let delay = getQueryParams().Trackdelay;

    //on a défini 2 delay
    let noteDelay;
    let musicDelay;

    if(delay<0){
      musicDelay = Math.abs(delay);
      noteDelay = 0;
    }else{
      noteDelay = delay;
      noteDelay = 0;
    }

    this.gameView.addMovingNotes(this.noteInterval, this.beatmap, noteDelay);

    // Mode enregistrement !!!!

    this.gameView.setStartTimeRecord();
    this.gameView.addNoteRecord();
    
    this.gameStartEl.className = "start hidden";
    this.started = true;
    
    //code before the pause
    var spotifyAPI = this.spAPI;
    setTimeout(function(){
      var uri = getQueryParams().TrackURI;
      var access_token = getQueryParams().access_token;
      if (uri) {
        console.log('send request to play '+uri);
        spotifyAPI.play(access_token, getQueryParams().TrackURI, null);
      } else {
        console.error('Cannot play : no spotify URI specified !')
      }
    }, musicDelay);
    
  }


  hitAToStart(e) {
    if (!this.started) {
      if (e.keyCode === 97 || e.keyCode === 65) {
        this.startGame();
      }

    }else{
      if (e.keyCode == 27){
        console.log("vous avez appuyé sur échap")
        document.getElementsByClassName('pause')[0].className="pause"
        var access_token = getQueryParams().access_token;
        this.gameView.isPlay = false;
        this.spAPI.pause(access_token);
        this.started = false;
      } else if (e.keyCode == 120 || e.keyCode == 88) {
        console.log("goooooo envoyer !!!!!")
        console.log(this.gameView.recordMap);
        
        this.sendOsuFile(JSON.stringify(this.gameView.recordMap));
        console.log("sent !")
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
      }
    })

    this.beatmap = osuData;
    
  }

  sendOsuFile(recordMap){
    // AJAX request
    jquery.ajax({
      async: false,
      type:'POST',
      url: '/send_osu',
      data: recordMap,
      success: function(response) {
        console.log(response);
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

export default Game;
