/** @format */
require("dotenv").config();
const webpack = require("webpack");
const path = require("path");

const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    port: 3002,
    hot: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    path: path.join(__dirname, "/build"), // Folder that store file has been built
    filename: "bundle.js", // Built file name
    publicPath: "/",
    clean: true,
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      "REACT_APP_API_URL",
      "REACT_APP_WEB_VERSION",
      // "REACT_APP_API_PORT",
      "REACT_APP_API_URL",
      "REACT_APP_IS_PROD",
    ]),
  ],
});
