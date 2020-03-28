import * as THREE from "../lib/three.min";
import jquery from "../lib/jquery.min";
import Key from "../lib/key";
import GameView from "../lib/game_view";
import Instructions from "../lib/instructions";
import SpotifyAPI from "../lib/SpotifyAPI";
import { getQueryParams, updateQueryStringParameter } from "../lib/functions";

import "../css/game.scss";

document.addEventListener("DOMContentLoaded", () => {
  new Game();
});

let audio;

class Game {
  constructor() {
    this.noteInterval = 237.8;
    this.musicDelay   = 1250;
    this.key          = new Key();
    this.instructions = new Instructions();
    this.started      = false;
    this.beatmap      = [];
    this.spAPI        = new SpotifyAPI();

    //get audio mode : mp3 or track (=spotify)
    this.audioMode = getQueryParams().audio;

    this.gameStartEl = document.getElementsByClassName("start")[0];
    this.createGameView();
    this.setupGame();

    document.getElementsByClassName("retry-pause")[0].onclick = function() {
      document.location.reload(false);
    };

    document.getElementsByClassName("record-pause")[0].onclick = function() {
      window.location.search += "&mode=record";
    };

    document.getElementsByClassName("select-pause")[0].onclick = function() {
      window.location.href =
        "/select?table=track%20mp3&access_token=" +
        getQueryParams().access_token;
    };

    document.getElementsByClassName("record-pause")[0].onclick = function() {
      let url = updateQueryStringParameter(
        window.location.href,
        "Trackdelay",
        0
      );
      url = updateQueryStringParameter(url, "mode", "record");
      window.location = url;
    };

    document.getElementsByClassName("save-score")[0].onclick = function() {
      var scoreTosave = document.getElementsByClassName("score")[0].innerHTML;
      scoreTosave = scoreTosave.replace(/^\D+/g, "");

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
    };

    document.getElementsByClassName("open-pause")[0].onclick = function() {
      document.getElementsByClassName("pause")[0].className = "pause";
      this.pauseMusic();
      this.started = false;
    };
  }

  setupGame() {
    this.getOsuFile();

    //case of mp3 => we retrieve the audio file and load it with an Audio object
    if (this.audioMode == "mp3") {
      jquery.ajax({
        async: false,
        type : "GET",
        url  : "/mp3/" + getQueryParams().Filename,
        data : "",
        success: function(response) {
          console.log("Successfully got file from server.");
          audio     = new Audio();
          audio.src = "data:audio/mp3;base64," + response.fileContent;
          audio.load();
        },
        error: function(response) {
          console.log("ERROR : Could not get file from server !");
        }
      });
    }

    //add event listener to start the game
    window.addEventListener("keydown", this.hitAToStart.bind(this));
    window.addEventListener("touchstart", e => {
      if (!this.started) {
        this.startGame();
      }
    });
  }

  startGame() {
    this.gameView.setStartTimeRecord();

    if (getQueryParams().mode === "record") {
      this.gameView.addNoteRecord();
    } else {
      this.gameView.addMovingNotes(this.noteInterval, this.beatmap, 0);
    }

    let musicDelay = getQueryParams().Trackdelay;
    this.playMusic(musicDelay);

    this.gameStartEl.className = "start hidden";
    this.started = true;
  }

  hitAToStart(e) {
    if (!this.started) {
      if (e.keyCode === 97 || e.keyCode === 65) {
        //user pressed "A" key => we start the game
        this.startGame();
      }
    }

    if (e.keyCode == 27) {
      //user pressed "Esc" key => we pause the game
      this.pauseMusic();

      //display pause overlay
      document.getElementsByClassName("pause")[0].className = "pause";
      this.gameView.isPlay = false;
      this.started = false;
    } else if (
      (e.keyCode == 122 || e.keyCode == 90) &&
      getQueryParams().mode === "record"
    ) {
      //User pressed "Z" key and is in recordMode => send .osu file to database
      var filename = getQueryParams()
        .Trackartist.split(" ")
        .join("");
      filename +=
        "_" +
        getQueryParams()
          .Trackname.split(" ")
          .join("") +
        ".osu";

      //deal with both cases : Spotify uri or filename
      let uri = getQueryParams().TrackURI || getQueryParams().Filename;
      this.sendOsuFile(filename, this.gameView.recordMap, this.audioMode, uri);
      console.log("Recorded beatmap sent to server");
      console.log(this.gameView.recordMap);
    } else if (e.keyCode == 186 && this.gameView) {
      //User pressed "$" key => set new delay for this track
      let delay = new Date().getTime() - this.gameView.startTimeRecord;
      console.log("vous avez appuyé sur $ : délai = " + delay);

      this.pauseMusic();
      this.gameView.isPlay = false;

      const audio = getQueryParams().audio;
      let trackID;

      if (audio == "track") {
        delay -= 1200;
        trackID = getQueryParams().TrackURI;
      } else if (audio == "mp3") {
        delay -= 300;
        trackID = getQueryParams().Filename;
      }

      this.updateDelay(audio, trackID, delay);
      console.log("New delay= " + delay + "sent to server.");
    }
  }

  /** Play music accord to audioMode (mp3 or track) with a delay = musicDelay param
   * @param {number}  musicDelay  Delay of the music before playing
   */
  playMusic(musicDelay) {
    switch (this.audioMode) {
      case "track":
        setTimeout(() => {
          var uri = getQueryParams().TrackURI;
          if (uri) {
            let access_token = getQueryParams().access_token;
            this.spAPI.setVolume(access_token, 50);
            console.log("send request to play " + uri);
            this.spAPI.play(access_token, getQueryParams().TrackURI, null);
          } else {
            console.error("Cannot play : no spotify URI specified !");
          }
        }, musicDelay);
        break;

      case "mp3":
        setTimeout(() => {
          audio.play();
        }, musicDelay);
        break;

      default:
        break;
    }
  }

  pauseMusic() {
    switch (this.audioMode) {
      case "track":
        let access_token = getQueryParams().access_token;
        this.spAPI.pause(access_token);
        break;

      case "mp3":
        audio.pause();
        break;

      default:
        break;
    }
  }

  /** Retrieve .osu file from URL param "OSUfile"
   */
  getOsuFile() {
    let osuData;
    // AJAX request
    jquery.ajax({
      async: false,
      type : "GET",
      url  : "/osu/" + getQueryParams().OSUfile,
      data : "",
      success: function(response) {
        osuData = JSON.parse(response);
        console.log("Successfully got file from server.");
      },
      error: function(response) {
        console.log("ERROR : Could not get file from server !");
      }
    });

    this.beatmap = osuData;
  }

  /** Play music accord to audioMode (mp3 or track) with a delay = musicDelay param
   * @param {string}  filename    filename of the osu file
   * @param {object}  recordMap   mapping of hitObjects recorded
   * @param {string}  tableName   tableName
   * @param {string}  uri         url of either mp3 in DB or TrackURI for Spotify
   */
  sendOsuFile(filename, recordMap, tableName, uri) {
    //Upload .osu file on server
    jquery.ajax({
      async: false,
      type: "POST",
      url: "/osu/" + filename,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(recordMap),
      success: function(response) {
        //Update DB table
        jquery.ajax({
          async: false,
          type: "PUT",
          url: "/database/" + tableName + "/" + uri,
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({
            0: "OSUfile = '" + filename + "', Trackdelay = " + 2000 + ""
          }),
          success: function(response) {
            console.log("Chained AJAX successfull !");
            //---> need to advert user
            window.location.replace(
              "/select?table=track%20mp3&access_token=" +
                getQueryParams().access_token
            );
          },
          error: function(response) {
            document.location.reload(false);
          }
        });
      },
      error: function(response) {
        document.location.reload(false);
      }
    });
  }

  /**
   * Update the delay of a give track either mp3 or spotify
   * @param {string} trackOrMP3 
   * @param {string} trackID 
   * @param {number} delay 
   */

  updateDelay(trackOrMP3, trackID, delay) {
    // Update 
    jquery.ajax({
      async: false,
      type: "PUT",
      url: "/database/" + trackOrMP3 + "/" + trackID,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ 0: "Trackdelay = " + delay + "" }),
      success: function(response) {
        window.location.href =
          "/select?table=track%20mp3" +
          "&UserURI=" +
          getQueryParams().UserURI +
          "&access_token=" +
          getQueryParams().access_token;
      },
      error: function(response) {
        alert("Database PUT request failed !");
        //document.location.reload(false);
      }
    });
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
    let camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

    camera.position.z = 150;

    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    document.getElementById("game-canvas").appendChild(renderer.domElement);

    this.gameView = new GameView(
      renderer,
      camera,
      scene,
      this.key,
      this.musicDelay
    );
    this.gameView.setup();
  }
}
