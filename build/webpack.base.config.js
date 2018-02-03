"use strict";

let path = require("path");
let webpack = require("webpack");

module.exports = {
  devtool: "#inline-source-map",

  entry: {
    spa: ["./client/spa/main.js"],
    vendor: [
      "vue",
      "vue-router",
      "vuex",
      "axios"
    ],
    dynamic: ["./client/dynamic/dynamic.js"]
  },

  output: {
    path: path.resolve(__dirname, "..", "server", "public", "app"),
    publicPath: "/app/",
    filename: "[name].js",
    chunkFilename: "[chunkhash].js"
  },

  module: {
    // noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
      exclude: [/node_modules/, /vendor/]
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        prefix: "img/",
        limit: 10000
      }
    }, {
      test: /\.(woff2?)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        prefix: "font/",
        limit: 10000
      }
    }]
  },

  resolve: {
    extensions: [".vue", ".js", ".json", ".css"],
    modules: [
      path.join(__dirname, '..', 'client', 'dynamic'),
      path.join(__dirname, '..', 'client', 'spa'),
      path.join(__dirname, '..', 'node_modules')
    ]
  },

  performance: {
    hints: false
  }
};
