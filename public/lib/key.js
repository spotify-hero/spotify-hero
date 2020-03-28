// KEY LOGIC ADAPTED FROM https://github.com/nklsrh/BuildNewGames_ThreeJSGame/blob/gh-pages/Scripts/keyboard.js
// Will use this Key.isDown boolean to test if it is being pressed at the right time.

class Key {
  constructor() {
    this._pressed = {};
    this._pressedVisually = {};
    this.started = false;
    this.pos = {
      0: 83,
      1: 68,
      2: 75,
      3: 76
    };
    this.S = 83; // songNote.pos: 1
    this.D = 68; // songNote.pos: 2
    this.K = 75; // songNote.pos: 3
    this.L = 76; // songNote.pos: 4

    this.addKeyListeners();
  }

  addKeyListeners() {
    window.addEventListener("keydown", e => {
      this.onKeydown(e.keyCode);
    });
    window.addEventListener("keyup", e => {
      this.onKeyup(e.keyCode);
    });

    window.addEventListener("touchstart", e => {
      e.preventDefault();
      var touchlist = e.touches;
      for (var i = 0; i < touchlist.length; i++) {
        var x = touchlist[i].clientX / window.innerWidth;
        this.onKeydown(this.getPosition(x));
      }
    });

    window.addEventListener("touchend", e => {
      e.preventDefault();
      var touchlist = e.changedTouches;
      for (var i = 0; i < touchlist.length; i++) {
        var x = touchlist[i].clientX / window.innerWidth;
        this.onKeyup(this.getPosition(x));
      }
    });
  }

  getPosition(x) {
    if (x >= 0.1 && x <= 0.3) {
      return this.pos[0];
    }

    if (x > 0.3 && x <= 0.5) {
      return this.pos[1];
    }

    if (x > 0.5 && x <= 0.7) {
      return this.pos[2];
    }

    if (x >= 0.7 && x <= 0.9) {
      return this.pos[3];
    }
  }

  touchStartHandler() {
    if (e.touches) {
      playerX = e.touches[0].pageX - canvas.offsetLeft;
      playerY = e.touches[0].pageY - canvas.offsetTop;
      output.innerHTML = "Touch: " + " x: " + playerX + ", y: " + playerY;
      e.preventDefault();
    }
  }

  isDown(keyCode) {
    return this._pressed[keyCode];
  }

  isDownVisually(keyCode) {
    return this._pressedVisually[keyCode];
  }

  onKeydown(keyCode) {
    this._pressed[keyCode] = true;
    this._pressedVisually[keyCode] = true;
  }

  onKeyup(keyCode) {
    delete this._pressedVisually[keyCode];
    let buffer = 200; // buffer for leniency
    setTimeout(() => {
      delete this._pressed[keyCode];
    }, buffer);
  }
}

export default Key;
