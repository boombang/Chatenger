"use strict";

let path = require("path");
let webpack = require("webpack");

let merge = require("webpack-merge");
let baseWpConfig = require("./webpack.base.config");

module.exports = merge(baseWpConfig, {
  module: {
    rules: [{
      test: /\.vue$/,
      loader: "vue-loader"
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor"
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("styles/[name].css")
  ]
});
