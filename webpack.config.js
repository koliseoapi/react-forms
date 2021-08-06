/**

Compile the example file.
This is needed only to check things manually using the browser. 
The automated tests use Jest and Babel without going through Webpack.

*/

const webpack = require("webpack");

module.exports = {
  entry: {
    app: "./test-page/example.tsx",
  },
  devtool: "source-map",
  output: {
    path: __dirname + "/build",
    publicPath: "/build/",
    filename: "example.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin()],
};
