/**

Compile the example file.
This is needed only to check things manually using the browser. 
The automated tests use Jest and Babel without going through Webpack.

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
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loaders: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new WebpackNotifierPlugin({ excludeWarnings: true, alwaysNotify: true })
  ]
};
