const path = require('path');

module.exports = {

  entry: {
    game: "./public/lib/game_main.js",
    spotify: "./public/lib/spotify_main.js",
    select: "./public/lib/select_main.js"
  },

  output: {
    path: path.resolve(__dirname, 'public/build/'),
    filename: "[name]-bundle.js"
  },

  mode: 'development'
};
