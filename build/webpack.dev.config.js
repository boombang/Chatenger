"use strict";

let path = require("path");
let webpack = require("webpack");

let merge = require("webpack-merge");
let baseWpConfig = require("./webpack.base.config");

baseWpConfig.entry.spa.unshift("webpack-hot-middleware/client");
baseWpConfig.entry.dynamic.unshift("webpack-hot-middleware/client");

module.exports = merge(baseWpConfig, {
  devtool: "#inline-source-map",

  module: {
    rules: [{
      test: /\.vue$/,
      loader: "vue-loader"
    }, {
      test: /\.css$/,
      loaders: ["style-loader", "css-loader"]
    }]
  },

  performance: {
    hints: false
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});
