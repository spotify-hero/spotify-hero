import * as THREE from "./three.min";
import ViewControls from "./view_controls";
import Light from "./light";
import GameNotes from "./game_notes";
import { getQueryParams, diffObj } from "./functions";

class GameView {
  constructor(renderer, camera, scene, key, musicDelay) {
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
    this.key = key;
    this.musicDelay = musicDelay;

    //gestion des modes
    this.isPlay = true;
    this.isRecord = false;

    this.note = {};

    this.zStartPoint = -500;
    this.zEndPoint = 0;
    this.yStartPoint = 50;
    this.yEndPoint = -110;
    this.xPos = [-45, -15, 15, 45];

    this.xRotation = -Math.atan(
      (this.zEndPoint - this.zStartPoint) / (this.yStartPoint - this.yEndPoint)
    );

    //différents tableaux
    this.spheres = [];
    this.cylinders = [];
    this.beatLines = [];
    this.recordMap = [];

    //gestion heure pour record
    this.startTimeRecord = 0;
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
    let width, height;

    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });
  }

  backgroundSetup() {
    let coverGeometry = new THREE.BoxGeometry(800, 800, 985);
    var texture = new THREE.TextureLoader().load(getQueryParams().track_cover);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    texture.minFilter = THREE.NearestFilter;
    let coverMaterials = [
      "",
      "",
      "",
      "",
      "",
      new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide
      })
    ];

    let backgroundGeometry = new THREE.BoxGeometry(2000, 1000, 1000);
    var texture = new THREE.TextureLoader().load("img/selectbackground.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    texture.minFilter = THREE.NearestFilter;
    let backgroundMaterials = [
      "",
      "",
      "",
      "",
      "",
      new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide
      })
    ];

    let backgroundMaterial = new THREE.MeshFaceMaterial(backgroundMaterials);
    let coverMaterial = new THREE.MeshFaceMaterial(coverMaterials);

    this.light = new Light(this.scene);
    this.light.addLights();
    // this.light.addMovingLights();

    let background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    let cover = new THREE.Mesh(coverGeometry, coverMaterial);
    this.scene.add(background);
    this.scene.add(cover);

    // LINES (STRINGS)
    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < 4; i++) {
      let lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(
        new THREE.Vector3(this.xPos[i], this.yStartPoint, this.zStartPoint)
      );
      lineGeometry.vertices.push(
        new THREE.Vector3(this.xPos[i], this.yEndPoint, this.zEndPoint)
      );
      let line = new THREE.Line(lineGeometry, this.lineMaterial);
      this.scene.add(line);
    }
  }

  addFretBoard() {
    let width = this.xPos[3] - this.xPos[0] + 50;
    let height = Math.sqrt(
      Math.pow(this.zEndPoint - this.zStartPoint, 2) +
        Math.pow(this.yEndPoint - this.yStartPoint, 2)
    );
    let boardGeometry = new THREE.PlaneGeometry(width, height);
    let boardMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    let board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.rotateX(this.xRotation);
    board.position.set(0, -35, -245);
    this.scene.add(board);
  }

  setNoteAttributes() {
    this.note.vel = 0.75;

    this.note.yVel =
      (this.note.vel * (this.yEndPoint - this.yStartPoint)) / 100;
    this.note.zVel =
      (this.note.vel * (this.zEndPoint - this.zStartPoint)) / 100;

    this.note.radius = 7.5;

    this.note.colors = [];
    this.note.colors[0] = 0x2edda5;
    this.note.colors[1] = 0x2edda5;
    this.note.colors[2] = 0x2edda5;
    this.note.colors[3] = 0x2edda5;
    this.note.colors[4] = 0xffffff;

    this.note.geometry = new THREE.BoxGeometry(this.note.radius * 2.5, 10, 10);

    this.note.materials = [];
    this.note.colors.forEach((color, idx) => {
      this.note.materials[idx] = new THREE.MeshPhongMaterial({
        color: this.note.colors[idx]
      });
    });

    const rectangleGeometry = new THREE.BoxGeometry(
      this.note.radius * 2.5,
      5,
      10
    );
    const circles = [];
    for (let i = 0; i < 4; i++) {
      circles[i] = new THREE.Mesh(rectangleGeometry, this.note.materials[i]);
    }

    circles.forEach((circle, idx) => {
      circle.position.set(this.xPos[idx], this.yEndPoint, this.zEndPoint);
      //circle.rotateX(-.2);

      // LIGHT UP CIRCLE WHEN KEY IS PRESSED
      setInterval(() => {
        if (this.key.isDownVisually(this.key.pos[idx])) {
          circle.material = this.note.materials[4];
        } else {
          circle.material = this.note.materials[idx];
        }
      }, 40);

      this.scene.add(circle);
    });
  }

  addMovingNotes(noteInterval, beatmap, latency) {
    let noteMaterial;

    this.gameNotes = new GameNotes(noteInterval, this.musicDelay, this.key);

    if (typeof beatmap !== "undefined" && beatmap.length > 0) {
      //total count of notes 0 indexed
      let notesCount = beatmap.length - 1;

      beatmap.forEach((songNote, idx) => {
        noteMaterial = this.note.materials[songNote.position];
        this.spheres[idx] = new THREE.Mesh(this.note.geometry, noteMaterial);

        if (songNote.duration > 0) {
          let cylinderMaterial = this.note.materials[songNote.position];
          let cylinderGeometry = new THREE.BoxGeometry(
            this.note.radius * 2.5,
            (songNote.duration / 3) * this.note.vel,
            10
          );
          this.cylinders[idx] = new THREE.Mesh(
            cylinderGeometry,
            cylinderMaterial
          );
          this.cylinders[idx].rotateX(this.xRotation);
        }

        // Position & add to scene notes + Long notes
        setTimeout(() => {
          if (this.cylinders[idx]) {
            let hold = songNote.duration / 32;
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
            this.yStartPoint,
            this.zStartPoint
          );

          if (idx == notesCount) {
            setTimeout(() => {
              var scoreTosave = document.getElementsByClassName("score")[0]
                .innerHTML;
              scoreTosave = scoreTosave.replace(/^\D+/g, "");
              document.getElementsByClassName("result-score")[0].innerHTML =
                "Your score : " + scoreTosave;
              document.getElementsByClassName("end-game")[0].className =
                "end-game";
            }, 7000 + songNote.duration);
          }
        }, songNote.startTime + latency);
        this.gameNotes.setNoteCheck(
          songNote.position,
          songNote.startTime + latency,
          songNote.duration
        );
      });
    }
  }

  addNoteRecord() {
    this.isRecord = true;

    //const for the initial value of velocity !!!!
    const INTERVAL = 20;
    const ALPHA = 0.7;
    const MIN_DURATION = 300;

    let temp;
    let idx = 0;

    const dist = Math.sqrt(
      this.note.yVel * this.note.yVel + this.note.zVel * this.note.zVel
    );
    const cylinderGeometry = new THREE.BoxGeometry(
      this.note.radius * 2.5,
      0,
      10
    );

    //We retrieve keyCodes from key class to adapt user preferences
    let keys = [];
    for (let i = 0; i < 4; i++) {
      keys.push(this.key.pos[i]);
    }

    let dictKey = {};
    //create seperated variables for each rows
    for (let i = 0; i < keys.length; i++) {
      dictKey[keys[i]] = {
        keyIdx: 0,
        first: true,
        position: i,
        startTime: undefined,
        cylinderMaterial: this.note.materials[i]
      };
    }

    setInterval(() => {
      //compute the remaining keys from previous iteration
      let diff = diffObj(temp, this.key._pressedVisually);
      //do for loop on common keys
      //if first time : we create the note

      Object.keys(dictKey).forEach(key => {
        if (diff !== undefined && diff.length > 0 && diff.includes(key)) {
          if (dictKey[key].first) {
            //compute startime of the note :
            dictKey[key].startTime = parseInt(Date.now());

            //save idx
            dictKey[key].keyIdx = idx;
            idx += 1;

            this.cylinders[dictKey[key].keyIdx] = new THREE.Mesh(
              cylinderGeometry,
              dictKey[key].cylinderMaterial
            );
            //apply rotation to fit playground
            this.cylinders[dictKey[key].keyIdx].rotateX(this.xRotation);
            this.cylinders[dictKey[key].keyIdx].position.set(
              this.xPos[dictKey[key].position],
              this.yEndPoint,
              this.zEndPoint
            );

            this.scene.add(this.cylinders[dictKey[key].keyIdx]);

            //prevent creating new note next time
            dictKey[key].first = false;
          } else {
            //if same keycode we make the note longer
            //increase note size
            this.cylinders[dictKey[key].keyIdx].scale.y += dist;

            //transformation due to symmetry scaling in threeJS
            this.cylinders[dictKey[key].keyIdx].position.y +=
              this.note.yVel * ALPHA;
            this.cylinders[dictKey[key].keyIdx].position.z +=
              this.note.zVel * ALPHA;
          }
        } else {
          if (dictKey[key].startTime !== undefined) {
            //we compute the duration of the note
            let duration = parseInt(Date.now()) - dictKey[key].startTime;

            if (duration < MIN_DURATION) {
              duration = 0;
            }

            //We can now push the not into the recordMap
            this.recordMap.push({
              position: dictKey[key].position,
              startTime: dictKey[key].startTime - this.startTimeRecord,
              duration: dictKey[key].startTime - this.startTimeRecord + duration
            });
            //we reintialize variables
            dictKey[key].first = true;
            dictKey[key].startTime = undefined;
          }
        }
      });
      temp = this.key._pressedVisually;
      //sample status of keys
    }, INTERVAL);
  }

  setStartTimeRecord() {
    let date = new Date();
    this.startTimeRecord = date.getTime();
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
        if (
          cylinder.position.z >
          this.zEndPoint + cylinder.hold * this.note.zVel
        ) {
          this.scene.remove(cylinder);
        }
      }
    });
  }

  recordUpdate() {
    this.spheres.forEach(sphere => {
      sphere.position.y -= this.note.yVel;
      sphere.position.z -= this.note.zVel;
      if (sphere.position.z < this.zStartPoint) {
        this.scene.remove(sphere);
      }
    });
    this.cylinders.forEach(cylinder => {
      if (cylinder) {
        cylinder.position.y -= this.note.yVel;
        cylinder.position.z -= this.note.zVel;
        if (
          cylinder.position.z <
          this.zStartPoint + cylinder.hold * this.note.zVel
        ) {
          this.scene.remove(cylinder);
        }
      }
    });
  }

  sceneRender() {
    this.renderer.render(this.scene, this.camera);
  }

  gameLoop() {
    if (!this.isPlay) return;

    requestAnimationFrame(this.gameLoop.bind(this));

    if (!this.isRecord) {
      this.sceneUpdate();
    } else {
      this.recordUpdate();
    }

    this.sceneRender();
  }
}

export default GameView;
