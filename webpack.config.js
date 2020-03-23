const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',

  entry: {
    home: "./public/js/home.js",
    game: "./public/js/game.js",
    spotify: "./public/js/spotify.js",
    select: "./public/js/select.js",
  },

  output: {
    path: path.resolve(__dirname, 'public/build/'),
    filename: "[name]-bundle.js"
  },

  module: {
    rules: [

      // include stylesheets
      { test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          {
            loader: "sass-loader",
            options: { implementation: require("sass") }
          }
        ]
      },

      // includes images
      { test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: { outputPath: 'images' }
          }
        ]
      },

      // includes fonts
      { test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: { outputPath: 'images' }
          }
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name]-bundle.css"
    })
  ]
};
