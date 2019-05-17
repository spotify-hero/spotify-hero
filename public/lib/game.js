import * as THREE from '../vendor/three.min';
import PointerLockControls from '../vendor/PointerLockControls.js';
import OrbitControls from '../vendor/OrbitControls.js';
import jquery from '../vendor/jquery.min';

import Key from './key';
import GameNotes from './game_notes';
import GameView from './game_view';
import Instructions from './instructions';
import SpotifyAPI from './SpotifyAPI';
import {getHashParams, copyClipboard} from './functions';


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
      console.log("record !!! ")
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
    this.music = new Audio(this.musicDelay);
    this.getOsuFile();

    this.gameStartListener =
      window.addEventListener("keydown", this.hitAToStart.bind(this));
    
  }

  startGame() {
    let delay = -800;

    //on a défini 2 delay
    let noteDelay;
    let musicDelay;

    if(delay<0){
      musicDelay = Math.abs(delay);
      noteDelay = 0
    }else{
      noteDelay = delay;
      noteDelay = 0
    }

    this.gameView.addMovingNotes(this.noteInterval, this.beatmap, noteDelay);
    
    this.gameStartEl.className = "start hidden";
    this.started = true;
    
    var spotyAPI = this.spAPI
    //code before the pause
    setTimeout(function(){
      //do what you need here
      var uri = document.getElementById('input_uri').value;
      var deviceID = document.getElementById('input_device_id').value;
      console.log("PLAY CALLBACK : uri = "+uri+"  device id = "+deviceID);
      spotyAPI.play(uri, deviceID);
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
        this.gameView.isPlay = false;
        this.spAPI.pause();
        this.started = false;

      }
    }
    
  }

  getOsuFile(){
    let osuData;
    // AJAX request
    jquery.ajax({
      async: false,
      type:'GET',
      url: '/osu/warriyo_venom',
      data: '',
      success: function(response) {
        osuData = JSON.parse(response);
      }
    })

    this.beatmap = osuData;
    
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

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.getElementById('game-canvas').appendChild( renderer.domElement );

    this.gameView = new GameView(
      renderer, camera, scene, this.key, this.musicDelay
    );
    this.gameView.setup();
  }

  addMusic() {
    //this.music.startMusic();
    setTimeout(this.music.fadeOut.bind(this.music), 213000);
  }
}

export default Game;
