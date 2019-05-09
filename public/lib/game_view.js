import * as THREE from '../vendor/three';
import { songNotes, beatsPerMeasure } from './song';
import ViewControls from './view_controls';
import Light from './light';
import GameNotes from './game_notes';
import jquery from './jquery';

class GameView {
  constructor(renderer, camera, scene, key, musicDelay) {
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
    this.key = key;
    this.musicDelay = musicDelay;

    this.note = {};

    this.zStartPoint = -500;
    this.zEndPoint = 0;
    this.yStartPoint = 50;
    this.yEndPoint = -75;
    this.xPos = [-50, -25, 0, 25, 50];

    this.xRotation = -Math.atan(
      (this.zEndPoint - this.zStartPoint) / (this.yStartPoint - this.yEndPoint)
    );

    this.spheres = [];
    this.cylinders = [];
    this.beatLines = [];

    this.t = 0;
    this.measures = [0];
  }

  setup() {
    this.setWindowResizer();
    this.backgroundSetup();
    this.addFretBoard();
    this.setNoteAttributes();
    this.controls = new ViewControls(this.camera, this.renderer);
    this.gameLoop();
  }

  setWindowResizer() {
    let width,
      height;

    window.addEventListener( 'resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      this.renderer.setSize( width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });
  }

  backgroundSetup() {
    let backgroundGeometry = new THREE.BoxGeometry( 2000, 1000, 1000 );
    let backgroundMaterials = [ "", "", "", "", "",
      new THREE.MeshPhongMaterial( {
        map: new THREE.TextureLoader().load( 'photos/stage.jpeg' ),
        side: THREE.DoubleSide
      } )
    ];

    let backgroundMaterial = new THREE.MeshFaceMaterial( backgroundMaterials );

    this.light = new Light(this.scene);
    this.light.addLights();
    // this.light.addMovingLights();

    let background = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
    this.scene.add( background );

    // LINES (STRINGS)
    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
    for (let i = 0; i < 5; i++) {
      let lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(new THREE.Vector3(
        this.xPos[i], this.yStartPoint, this.zStartPoint));
      lineGeometry.vertices.push(new THREE.Vector3(
        this.xPos[i], this.yEndPoint, this.zEndPoint));
      let line = new THREE.Line(lineGeometry, this.lineMaterial);
      this.scene.add(line);
    }

  }

  addFretBoard() {
    let width = this.xPos[4] - this.xPos[0] + 50;
    let height = Math.sqrt(
      Math.pow((this.zEndPoint - this.zStartPoint), 2)
        + Math.pow((this.yEndPoint - this.yStartPoint), 2)
    );
    let boardGeometry = new THREE.PlaneGeometry( width, height );
    let boardMaterial = new THREE.MeshPhongMaterial( {
      color: 0x000000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: .6
    } );
    let board = new THREE.Mesh( boardGeometry, boardMaterial );
    board.rotateX(this.xRotation);
    board.position.set(0, -15, -250);
    this.scene.add( board ) ;
  }

  setNoteAttributes() {
    this.note.vel = .75;

    this.note.yVel = this.note.vel * (this.yEndPoint - this.yStartPoint) / 100;
    this.note.zVel = this.note.vel * (this.zEndPoint - this.zStartPoint) / 100;

    this.note.radius = 7.5;

    this.note.colors = [];
    this.note.colors[0] = 0x4C7048; // Green
    this.note.colors[1] = 0xDA3A3C; // Red
    this.note.colors[2] = 0xffeb3b; // Yellow
    this.note.colors[3] = 0x3f51b5; // Blue
    this.note.colors[4] = 0xff5722; // Orange
    this.note.colors[5] = 0xffffff; // White - selected

    this.note.geometry = new THREE.SphereGeometry(this.note.radius);

    this.note.materials = [];
    this.note.colors.forEach( (color, idx) => {
    this.note.materials[idx] =
       new THREE.MeshPhongMaterial( { color: this.note.colors[idx] } );
       console.log("MATERIALS :" + idx)
       console.log(this.note.materials[idx])
    });

    const circleGeometry = new THREE.CircleGeometry(this.note.radius);
    const circles = [];
    for (let i = 0; i < 5; i ++) {
      circles[i] = new THREE.Mesh(circleGeometry, this.note.materials[i]);
    }

    circles.forEach((circle, idx) => {
      circle.position.set(
      this.xPos[idx],
      this.yEndPoint,
      this.zEndPoint
      );
      circle.rotateX(-.2);

      // LIGHT UP CIRCLE WHEN KEY IS PRESSED
      setInterval( () => {
        if (this.key.isDownVisually(this.key.pos[idx + 1])) {
           circle.material = this.note.materials[5];
         } else {
           circle.material = this.note.materials[idx];
         }
      }, 100);

      this.scene.add(circle);
    });
  }

  addMovingNotes(noteInterval) {
    let noteMaterial;

    console.log("movin note : " + this.note.materials)

    this.gameNotes = new GameNotes(
      noteInterval, this.musicDelay, this.key
    );

    let beatmap;

    // AJAX request
    jquery.ajax({
      async: false,
      type:'GET',
      url: '/osu',
      data: '',
      success: function(response) {
        
        beatmap = JSON.parse(response);
        console.log('AJAX successful' + beatmap);
      }
    })

    beatmap.hitObjects.forEach((songNote, idx) => {
      console.log("index : " + idx, "position : " + songNote.position[0] + "start : " + songNote.startTime + "Duration : " + songNote.duration)

      let time = songNote.startTime;
      let position = 0;

      if (songNote.position[0]<128) {
        position = 0;
      }else if (songNote.position[0]<256) {
        position = 1;
      }else if (songNote.position[0]<384) {
        position = 2;
      }else {
        position = 3;
      }
      
      noteMaterial = this.note.materials[position];
      this.spheres[idx] = new THREE.Mesh(this.note.geometry, noteMaterial);

      let lag = 40

      if (typeof songNote.duration !== "undefined"){
        console.log("note longue !")
        console.log(songNote.duration);

        let cylinderMaterial = this.note.materials[position];
        let cylinderGeometry = new THREE.CylinderGeometry(
          3.5, 3.5, (songNote.duration * 1 * 30)
          // voir vélocity à la place de 1
        );
        this.cylinders[idx] = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        this.cylinders[idx].rotateX(this.xRotation);

      }

      //this.addMovingBeatLine(songNote.m, noteInterval, lag);

      // POSITION & ADD TO SCENE NOTES & HOLDS & BeatLines
      setTimeout( () => {
        if (this.cylinders[idx]) {
          let hold = songNote.duration * 3;
          this.cylinders[idx].hold = hold;
          this.cylinders[idx].position.set(
            this.xPos[position],
            this.yStartPoint - hold * this.note.yVel,
            this.zStartPoint - hold * this.note.zVel
          );
          this.scene.add(this.cylinders[idx]);
        }
        this.scene.add(this.spheres[idx]);
        this.spheres[idx].position.set(
          this.xPos[position],
          (this.yStartPoint),
          (this.zStartPoint));
        }, time
        );
      this.gameNotes.setNoteCheck(position, time);
    })
  }
      
  addMovingBeatLine(measure, noteInterval, lag) {
    if (this.measures[this.measures.length - 1] < measure) {
      this.measures.push(measure);
      let onBeatLineMaterial =
        new THREE.MeshBasicMaterial( { color: 0x999999});
      let offBeatLineMaterial =
        new THREE.MeshBasicMaterial( { color: 0x3b3b3b});
      let beatLineGeometry = new THREE.CylinderGeometry(
        .25, .25, (this.xPos[4] - this.xPos[0] + 50)
      );
      for (let t = 1; t < 9; t++ ) {
        let time = lag + noteInterval * (
          ((measure - 1) * beatsPerMeasure) + t
        );
        let idx = measure * beatsPerMeasure + t;
        if (t % 2 === 0) {
          this.beatLines[idx] =
            new THREE.Mesh(beatLineGeometry, offBeatLineMaterial);
        } else {
          this.beatLines[idx] =
            new THREE.Mesh(beatLineGeometry, onBeatLineMaterial);
        }

        setTimeout( () => {
          this.scene.add(this.beatLines[idx]);
          this.beatLines[idx].position.set(
            0, this.yStartPoint, this.zStartPoint
          );
          this.beatLines[idx].rotateZ(Math.PI / 2);
        }, time);
      }
    }
  }

  sceneUpdate() {
    this.spheres.forEach(sphere => {
      sphere.position.y += this.note.yVel;
      sphere.position.z += this.note.zVel;
      if (sphere.position.z > this.zEndPoint) {
        this.scene.remove(sphere);
      }
    });
    this.cylinders.forEach(cylinder => {
      if (cylinder) {
        cylinder.position.y += this.note.yVel;
        cylinder.position.z += this.note.zVel;
        if (cylinder.position.z > (this.zEndPoint + cylinder.hold * this.note.zVel)) {
          this.scene.remove(cylinder);
        }
      }
    });
    this.beatLines.forEach(beatLine => {
      if (beatLine) {
        beatLine.position.y += this.note.yVel;
        beatLine.position.z += this.note.zVel;
        if (beatLine.position.z > this.zEndPoint) {
          this.scene.remove(beatLine);
        }
      }
    });
    // this.t += .01;
    // this.light.movingLights[0].position.x = 5 * Math.cos(this.t) + 0;
    // this.light.movingLights[0].position.y = 5 * Math.sin(this.t) + 0;
  }

  sceneRender() {
    this.renderer.render(this.scene, this.camera);
  }

  gameLoop() {
    requestAnimationFrame(this.gameLoop.bind(this));

    this.sceneUpdate();
    this.sceneRender();
  }

}

export default GameView;
