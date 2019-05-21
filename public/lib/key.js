// KEY LOGIC ADAPTED FROM https://github.com/nklsrh/BuildNewGames_ThreeJSGame/blob/gh-pages/Scripts/keyboard.js
// Will use this Key.isDown boolean to test if it is being pressed at the right time.

class Key {
  constructor() {
    this._pressed = {};
    this._pressedVisually = {};
    this.pos = {
      0: 83,
      1: 68,
      2: 75,
      3: 76
    };
    this.A = 83;  // songNote.pos: 1
    this.S = 68;  // songNote.pos: 2
    this.D = 75;  // songNote.pos: 3
    this.F = 76;  // songNote.pos: 4

    this.addKeyListeners();
  }

  addKeyListeners() {
    window.addEventListener('keydown', (e) => {
      this.onKeydown(e);
    });
    window.addEventListener('keyup', (e) => {
      this.onKeyup(e);
    });
  }

  isDown(keyCode) {
    return this._pressed[keyCode];
  }

  isDownVisually(keyCode) {
    return this._pressedVisually[keyCode];
  }

  onKeydown(e) {
    if (e.keyCode == 27){
      //console.log("echap appuyé !!!");
    }
    this._pressed[e.keyCode] = true;
    this._pressedVisually[e.keyCode] = true;
  }

  onKeyup(e) {
    delete this._pressedVisually[e.keyCode];
    let buffer = 300; // buffer for leniency
    setTimeout( () => {
      delete this._pressed[e.keyCode];
    }, buffer);
  }

}

export default Key;
