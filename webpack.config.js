/**

Compile the example file.
This is needed only to check things manually using the browser. 
The automated tests use Mocha and Babel without going through Babel.

*/

const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");

module.exports = {
  entry: {
    app: "./test-page/example.js"
  },
  devtool: "source-map",
  output: {
    path: __dirname + "/build",
    publicPath: "/build/",
    filename: "example.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loaders: ["babel-loader?presets[]=react&presets[]=es2015"]
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new WebpackNotifierPlugin({ excludeWarnings: true, alwaysNotify: true })
  ]
};
