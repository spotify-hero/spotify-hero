const path = require('path');

module.exports = {

  entry: {
    game: "./public/lib/guitar_hero.js",
    spotify: "./public/lib/spotify_main.js"
  },

  output: {
    path: path.resolve(__dirname, 'public/build/'),
    filename: "[name]-bundle.js"
  },

  mode: 'development'
};
