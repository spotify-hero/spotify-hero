const path = require('path');


module.exports = {
  // context: __dirname,
  entry: "./public/lib/guitar_hero.js",
  // target: 'node',
  output: {
    path: path.resolve(__dirname, 'public/build/'),
  	filename: "bundle.js"
  },
  mode: 'development',
  // resolve: {
  //   extensions: ['.js']
  // },
  //devtool: 'source-map',
  //watch: true
};
