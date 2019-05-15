import * as THREE from '../vendor/three.min';
import ViewControls from './view_controls';
import Light from './light';
import GameNotes from './game_notes';

class GameView {
  constructor(renderer, camera, scene, key, musicDelay) {
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
    this.key = key;
    this.musicDelay = musicDelay;

    this.isPlay =  true;

    this.note = {};

    this.zStartPoint = -500;
    this.zEndPoint = 0;
    this.yStartPoint = 50;
    this.yEndPoint = -75;
    this.xPos = [-45, -15, 15, 45];

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
    let backgroundGeometry = new THREE.BoxGeometry( 1920, 1080, 1000 );
    var texture = new THREE.TextureLoader().load( 'photos/stage.jpeg' );
    texture.minFilter = THREE.NearestFilter;
    let backgroundMaterials = [ "", "", "", "", "",
      new THREE.MeshPhongMaterial( {
        map: texture,
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
    for (let i = 0; i < 4; i++) {
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
    let width = this.xPos[3] - this.xPos[0] + 50;
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
    this.note.colors[0] = 0x2EDDA5;
    this.note.colors[1] = 0x2EDDA5
    this.note.colors[2] = 0x2EDDA5;
    this.note.colors[3] = 0x2EDDA5;
    this.note.colors[4] = 0xFFFFFF;

    this.note.geometry = new THREE.BoxGeometry(this.note.radius*2.5,10,10);

    this.note.materials = [];
    this.note.colors.forEach( (color, idx) => {
    this.note.materials[idx] =
       new THREE.MeshPhongMaterial( { color: this.note.colors[idx] } );
    });

    const rectangleGeometry = new THREE.BoxGeometry(this.note.radius*2.5,5,10);
    const circles = [];
    for (let i = 0; i < 4; i ++) {
      circles[i] = new THREE.Mesh(rectangleGeometry, this.note.materials[i]);
    }

    circles.forEach((circle, idx) => {
      circle.position.set(
      this.xPos[idx],
      this.yEndPoint,
      this.zEndPoint
      );
      //circle.rotateX(-.2);

      // LIGHT UP CIRCLE WHEN KEY IS PRESSED
      setInterval( () => {
        if (this.key.isDownVisually(this.key.pos[idx])) {
           circle.material = this.note.materials[4];
         } else {
           circle.material = this.note.materials[idx];
         }
      }, 100);

      this.scene.add(circle);
    });
  }

  addMovingNotes(noteInterval, beatmap) {
    let noteMaterial;

    this.gameNotes = new GameNotes(
      noteInterval, this.musicDelay, this.key
    );

    beatmap.forEach((songNote, idx) => {

      noteMaterial = this.note.materials[songNote.position];
      this.spheres[idx] = new THREE.Mesh(this.note.geometry, noteMaterial);

      if (songNote.duration > 0 ){

        let cylinderMaterial = this.note.materials[songNote.position];
        let cylinderGeometry = new THREE.BoxGeometry(
          this.note.radius*2.5,(songNote.duration/10 * this.note.vel),10
        );
        this.cylinders[idx] = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        this.cylinders[idx].rotateX(this.xRotation);
      }


      //this.addMovingBeatLine(songNote.m, noteInterval, lag);

      // POSITION & ADD TO SCENE NOTES & HOLDS & BeatLines
      setTimeout( () => {
        if (this.cylinders[idx]) {
          let hold = songNote.duration/100 ;
          this.cylinders[idx].hold = hold;
          this.cylinders[idx].position.set(
            this.xPos[songNote.position],
            this.yStartPoint - hold * this.note.yVel,
            this.zStartPoint - hold * this.note.zVel
          );
          this.scene.add(this.cylinders[idx]);
        }
        this.scene.add(this.spheres[idx]);
        this.spheres[idx].position.set(
          this.xPos[songNote.position],
          (this.yStartPoint),
          (this.zStartPoint));
        }, songNote.startTime
        );
      this.gameNotes.setNoteCheck(songNote.position, songNote.startTime);
    })
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
    // this.t += .01;
    // this.light.movingLights[0].position.x = 5 * Math.cos(this.t) + 0;
    // this.light.movingLights[0].position.y = 5 * Math.sin(this.t) + 0;
  }

  sceneRender() {
    this.renderer.render(this.scene, this.camera);
  }

  gameLoop() {
    if (!this.isPlay) return;

    requestAnimationFrame(this.gameLoop.bind(this));

    this.sceneUpdate();
    this.sceneRender();
  }

}

export default GameView;
