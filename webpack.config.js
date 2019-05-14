const path = require('path');

module.exports = {

  entry: "./public/lib/guitar_hero.js",

  output: {
    path: path.resolve(__dirname, 'public/build/'),
  	filename: "bundle.js"
  },

  mode: 'development'
};
